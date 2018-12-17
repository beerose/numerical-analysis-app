import { hash } from 'bcrypt';
import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { apiMessages } from '../../../common/apiMessages';
import { db } from '../store';
import { connection } from '../store/connection';
import { setUserPasswordQuery, storeTokenQuery } from '../store/queries';

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
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
  return db.findUserByEmail({ email }, (err, userRes) => {
    if (err) {
      res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      return;
    }
    if (!userRes) {
      res.status(codes.FORBIDDEN).send({ error: 'failed to find user' });
      return;
    }

    return next();
  });
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
    res.status(codes.FORBIDDEN).send({ error: 'cannot verify jwt' });
    return;
  }

  if (!decoded.hasOwnProperty('email')) {
    res.status(codes.FORBIDDEN).send({ error: 'invalid jwt format' });
    return;
  }

  const email = (decoded as { email: string }).email;

  db.findUserByEmail({ email }, (findErr, userRes) => {
    if (findErr) {
      console.error({ findErr });
      res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      return;
    }
    if (!userRes) {
      res.status(codes.FORBIDDEN).send({ error: 'failed to find user' });
      return;
    }
    if (userRes.active_user) {
      res.status(codes.FORBIDDEN).send({ error: 'account already activated' });
      return;
    }
    res.locals.email = userRes.email;
    res.locals.user = userRes.user;
    return next();
  });
};

const SALT_ROUNDS = 10;

export const storeUserPassword = (
  req: CreateWithTokenRequest,
  res: CreateWithTokenResponse,
  next: NextFunction
) => {
  hash(req.body.password, SALT_ROUNDS, (hashingError, passwordHash) => {
    if (hashingError) {
      console.error({ hashingError });
      res.status(codes.INTERNAL_SERVER_ERROR).send({
        error: apiMessages.internalError,
      });
      return;
    }

    connection.query(
      {
        sql: setUserPasswordQuery,
        values: [passwordHash, res.locals.email],
      },
      (error, results) => {
        if (error) {
          console.error({ error });
          return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
        }
        if (!results.affectedRows) {
          return res.status(codes.NOT_FOUND).send({ error: apiMessages.userNotFound });
        }
        return next();
      }
    );
  });
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
