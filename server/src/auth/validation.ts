import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from '../../../common/apiMessages';

export const validateNewAccountRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.password && req.body.token) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidNewAccountRequest });
};

export const validateLoginUserRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.password && req.body.email) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidLoginRequest });
};
