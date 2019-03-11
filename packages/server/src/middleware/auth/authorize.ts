import { apiMessages, UserRole } from 'common';
import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { Either, left, right } from 'fp-ts/lib/Either';
import * as codes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { UserJwtTokenPayload } from '../../lib';
import { db } from '../../store';

type ErrorMsg = { error: string };

const fail = (msg: string): Either<ErrorMsg, UserJwtTokenPayload> =>
  left({ error: msg });

const decodeJwtUserToken = (
  str: string | undefined
): Either<ErrorMsg, UserJwtTokenPayload> => {
  if (!str || !str.startsWith('Bearer ')) {
    return fail('token is not jwt');
  }

  const token = str.substring(7, str.length);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || '');
  } catch {
    return fail('cannot verify jwt');
  }

  if (
    // TODO: Consider validating with runtime type from io-ts
    typeof decoded === 'object' &&
    'email' in decoded &&
    'user_role' in decoded &&
    'user_name' in decoded
  ) {
    return right(decoded as UserJwtTokenPayload);
  }

  return fail('invalid jwt format');
};

export const authorize = (roles: UserRole[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const decoded = decodeJwtUserToken(req.headers.authorization);
  decoded.fold(
    error => {
      res.status(codes.UNAUTHORIZED).send(error);
    },
    ({ email }) => {
      db.findUserByEmail({ email }, (err, userRes) => {
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

        res.locals.user = userRes;
        return next();
      });
    }
  );
};
