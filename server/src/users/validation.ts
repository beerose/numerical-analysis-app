import { NextFunction, Request, Response } from 'express';
import * as HTTPStatus from 'http-status-codes';

import { apiMessages } from '../../../common/apiMessages';

export const validateAddRequest = (req: Request, res: Response, next: NextFunction) => {
  const user = req.body;
  if (req.body && user.user_name && user.email && user.user_role) {
    return next();
  }
  return res.status(HTTPStatus.BAD_REQUEST).send({ error: apiMessages.invalidUserData });
};

export const validateUpdateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body;
  if (req.body && user.user_name && user.email && user.user_role && user.id) {
    return next();
  }
  return res.status(HTTPStatus.BAD_REQUEST).send({ error: apiMessages.invalidUserData });
};

export const validateDeleteRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.id) {
    return next();
  }
  return res.status(HTTPStatus.BAD_REQUEST).send({ error: apiMessages.idRequired });
};
