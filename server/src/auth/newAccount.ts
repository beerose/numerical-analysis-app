import { hash } from 'bcrypt';
import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { apiMessages } from '../../../common/apiMessages';
import { db } from '../store';

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
    res.status(codes.FORBIDDEN).send({ error: apiMessages.cannotVerifyJWT });
    return;
  }

  if (!decoded.hasOwnProperty('email')) {
    res.status(codes.FORBIDDEN).send({ error: apiMessages.invalidJWT });
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
      res.status(codes.FORBIDDEN).send({ error: apiMessages.userNotFound });
      return;
    }
    if (userRes.active_user) {
      res.status(codes.FORBIDDEN).send({ error: apiMessages.accountExists });
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

    db.setUserPassword({ passwordHash, email: res.locals.email || '' }, (error, results) => {
      if (error) {
        console.error({ error });
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      if (!results.affectedRows) {
        return res.status(codes.NOT_FOUND).send({ error: apiMessages.userNotFound });
      }
      return next();
    });
  });
};
