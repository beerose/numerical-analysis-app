import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import { getUserByEmial, setUserPassword } from '../store/queries';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (auth || !auth) return next(); // TO DO
  return res.status(401).send('You shall not pass!');
};

type FindUserResult = { user?: { user_name: string; user_role: string } | null; error?: boolean };
const findUserByEmail = (email: string, callback: (result: FindUserResult) => void) => {
  connection.query(
    {
      sql: getUserByEmial,
      values: [email],
    },
    (error, results) => {
      if (error) {
        return callback({ error: true });
      }
      if (!results.length) {
        return callback({ user: null });
      }
      return callback({ user: JSON.parse(JSON.stringify(results[0])) });
    }
  );
};

interface CreateWithTokenRequest extends Request {
  body: {
    token?: string;
    password?: string;
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
  if (!token) {
    return res.status(codes.BAD_REQUEST).send({ error: 'token is required' });
  }
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

export const storeUserPassword = (req: CreateWithTokenRequest, res: CreateWithTokenResponse) => {
  connection.query(
    {
      sql: setUserPassword,
      values: [req.body.password, res.locals.email],
    },
    (error, results) => {
      if (error) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      if (!results.affectedRows) {
        return res.status(codes.NOT_FOUND).send({ error: apiMessages.userNotFound });
      }
      return res.status(codes.OK).send(res.locals.user);
    }
  );
};
