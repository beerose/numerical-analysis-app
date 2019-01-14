import { apiMessages, UserRole } from 'common';
import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { db } from '../store';

const decodeJWTtoken = (
  auth: string | undefined
): { email?: string; user_role?: string; error?: string } => {
  if (!auth || !auth.startsWith('Bearer ')) {
    return { error: 'token is not jwt' };
  }

  const token = auth.substring(7, auth.length);
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return { error: 'cannot verify jwt' };
  }

  if (!decoded.hasOwnProperty('email')) {
    return { error: 'invalid jwt format' };
  }

  return decoded as { email?: string; user_role?: string };
};

export const authorize = (roles: UserRole[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, error } = decodeJWTtoken(req.headers.authorization);
  if (error) {
    res.status(codes.UNAUTHORIZED).send(error);
    return;
  }

  if (!email) {
    res.status(codes.UNAUTHORIZED).send({ error: 'no email in token' });
    return;
  }

  return db.findUserByEmail({ email }, (err, userRes) => {
    if (err) {
      res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError });
      return;
    }
    if (!userRes) {
      res.status(codes.FORBIDDEN).send({ error: 'failed to find user' });
      return;
    }
    if (!roles.includes(userRes.user_role)) {
      res.status(codes.FORBIDDEN).send({ error: 'not authorized' });
      return;
    }

    return next();
  });
};
