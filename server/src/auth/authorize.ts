import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { apiMessages } from 'common';
import { db } from '../store';

export const authorize = (req: Request, res: Response, next: NextFunction) => {
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
