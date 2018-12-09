import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from '../../../common/apiMessages';

export const validateUploadRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.data && req.body.group_id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidUserData });
};

export const validateListStudentsForGroupRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.query && req.query.group_id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidListStudentsForGroupReq });
};

export const validateDeleteStudentFromGroupRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body && req.body.user_id) {
    return next();
  }
  return res
    .status(codes.BAD_REQUEST)
    .send({ error: apiMessages.invalidDeleteStudentFromGroupReq });
};

export const validateUpdateStudentRequest = (req: Request, res: Response, next: NextFunction) => {
  const user = req.body;
  console.log(user);
  if (user && user.user_name && user.email && user.id) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidUserData });
};
