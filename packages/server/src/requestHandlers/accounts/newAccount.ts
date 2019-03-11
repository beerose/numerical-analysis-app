import { hash } from 'bcrypt';
import { apiMessages } from 'common';
import { NextFunction } from 'connect';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import jwt from 'jsonwebtoken';

import { BackendResponse, GetRequest, handleBadRequest } from '../../lib';
import { db } from '../../store';

const CreateWithTokenRequestV = t.type({
  password: t.string,
  token: t.string,
});

type CreateWithTokenRequest = GetRequest<typeof CreateWithTokenRequestV>;

export const checkNewAccountToken = (
  req: CreateWithTokenRequest,
  res: BackendResponse,
  next: NextFunction
) => {
  handleBadRequest(CreateWithTokenRequestV, req.body, res).then(() => {
    const { token } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || '');
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
        res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: findErr.message,
        });
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
      res.locals.user = userRes;
      return next();
    });
  });
};

const SALT_ROUNDS = 10;

export const storeUserPassword = (
  req: CreateWithTokenRequest,
  res: Response,
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

    db.setUserPassword(
      { passwordHash, email: res.locals.user ? res.locals.user.email : '' },
      (error, results) => {
        if (error) {
          console.error({ error });
          return res
            .status(codes.INTERNAL_SERVER_ERROR)
            .send({ error: apiMessages.internalError });
        }
        if (!results.affectedRows) {
          return res
            .status(codes.NOT_FOUND)
            .send({ error: apiMessages.userNotFound });
        }
        return next();
      }
    );
  });
};
