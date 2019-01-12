import { apiMessages } from 'common';
import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

export const validateDeleteRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.idRequired });
};
