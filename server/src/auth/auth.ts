import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import {
  findTokenQuery,
  getUserByEmialQuery,
  setUserPasswordQuery,
  storeTokenQuery,
} from '../store/queries';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(codes.FORBIDDEN).send({ error: 'cannot verify jwt' });
  }

  const token = auth.substring(7, auth.length);
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return res.status(codes.FORBIDDEN).send({ error: 'cannot verify jwt' });
  }

  if (!decoded.hasOwnProperty('email')) {
    return res.status(codes.FORBIDDEN).send({ error: 'invalid jwt format' });
  }

  const email = (decoded as { email: string }).email;
  return findUserByEmail(email, ({ user, error }) => {
    if (error) {
      return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
    }
    if (!user) {
      return res.status(codes.FORBIDDEN).send({ error: 'failed to find user' });
    }

    return next();
  });
};

type FindUserResult = { user?: { user_name: string; user_role: string } | null; error?: boolean };
const findUserByEmail = (email: string, callback: (result: FindUserResult) => void) => {
  connection.query(
    {
      sql: getUserByEmialQuery,
      values: [email],
    },
    (error, results) => {
      if (error) {
        return callback({ error: true });
      }
      if (!results.length) {
        return callback({ user: null });
      }
      return callback({ user: results[0] });
    }
  );
};

interface CreateWithTokenRequest extends Request {
  body: {
    token: string;
    password: string;
  };
}
interface CreateWithTokenResponse extends Response {
  locals: {
    email?: string;
    user?: { user_name: string; user_role: string };
  };
}

export const checkIfTokenExpired = (
  req: CreateWithTokenRequest,
  res: CreateWithTokenResponse,
  next: NextFunction
) => {
  const { token } = req.body;
  connection.query(
    {
      sql: findTokenQuery,
      values: [token],
    },
    (error, results) => {
      if (error) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      if (results.length) {
        return res.status(codes.BAD_REQUEST).send({ error: apiMessages.tokenUsed });
      }
      return next();
    }
  );
};

export const validateNewAccountToken = (
  req: CreateWithTokenRequest,
  res: CreateWithTokenResponse,
  next: NextFunction
) => {
  const { token } = req.body;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return res.status(codes.FORBIDDEN).send({ error: 'cannot verify jwt' });
  }

  if (!decoded.hasOwnProperty('email')) {
    return res.status(codes.FORBIDDEN).send({ error: 'invalid jwt format' });
  }

  const email = (decoded as { email: string }).email;
  return findUserByEmail(email, ({ user, error }) => {
    if (error) {
      return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
    }
    if (!user) {
      return res.status(codes.FORBIDDEN).send({ error: 'failed to find user' });
    }
    res.locals.email = email;
    res.locals.user = user;
    return next();
  });
};

export const storeUserPassword = (
  req: CreateWithTokenRequest,
  res: CreateWithTokenResponse,
  next: NextFunction
) => {
  connection.query(
    {
      sql: setUserPasswordQuery,
      values: [req.body.password, res.locals.email],
    },
    (error, results) => {
      if (error) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      if (!results.affectedRows) {
        return res.status(codes.NOT_FOUND).send({ error: apiMessages.userNotFound });
      }
      return next();
    }
  );
};

export const storeToken = (req: CreateWithTokenRequest, res: CreateWithTokenResponse) => {
  connection.query(
    {
      sql: storeTokenQuery,
      values: [req.body.token],
    },
    error => {
      if (error) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      return res.status(codes.OK).send({ token: req.body.token, ...res.locals.user });
    }
  );
};
