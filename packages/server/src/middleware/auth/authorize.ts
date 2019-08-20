import { apiMessages, UserDTO, UserRole } from 'common';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import {
  chain as chainEither,
  Either,
  fold,
  left,
  right,
} from 'fp-ts/lib/Either';
import { task } from 'fp-ts/lib/Task';
import * as TaskEither from 'fp-ts/lib/TaskEither';
import * as codes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { MysqlError } from 'mysql';

import { UserJwtTokenPayload } from '../../lib';
import { db } from '../../store';

const decodeJwtUserToken = (str: string | undefined) => {
  if (!str || !str.startsWith('Bearer ')) {
    return left({
      code: codes.UNAUTHORIZED,
      error: 'token is malformed or missing',
    });
  }

  const token = str.substring(7, str.length);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || '');
  } catch {
    return left({
      code: codes.UNAUTHORIZED,
      error: 'cannot verify jwt',
    });
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

  return fail({
    code: codes.UNAUTHORIZED,
    error: 'invalid jwt format',
  });
};

const findByEmail = ({ email }: { email: string }) =>
  TaskEither.tryCatch(
    () =>
      new Promise<UserDTO | null>((resolve, reject) =>
        db.findUserByEmail({ email }, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        })
      ),
    err => ({
      code: codes.INTERNAL_SERVER_ERROR,
      error: (err as MysqlError).message,
    })
  );

// TODO: Move this function to a better place?
export const authorizeWithToken = (
  authorizationHeader: string | undefined,
  roles: UserRole[]
) =>
  pipe(
    decodeJwtUserToken(authorizationHeader),
    TaskEither.fromEither,
    TaskEither.chain(findByEmail),
    TaskEither.chain(
      flow(
        userRes => {
          if (!userRes) {
            return left({
              code: codes.FORBIDDEN,
              error: 'failed to find user',
            });
          }
          if (!roles.includes(userRes.user_role)) {
            return left({
              code: codes.FORBIDDEN,
              error: 'not authorized',
            });
          }
          return right(userRes);
        },
        TaskEither.fromEither
      )
    )
  );

/**
 * Authorization middleware
 */
export const authorize = (roles: UserRole[]): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authorizeWithToken(req.headers.authorization, roles)().then(
    flow(
      fold(
        error => {
          res.status(error.code).send(error);
        },
        user => {
          res.locals.user = user;
          next();
        }
      )
    )
  );
};

declare module 'express' {
  interface Response {
    locals: {
      user?: UserDTO;
    };
  }
}
