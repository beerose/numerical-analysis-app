import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from '../../../common/apiMessages';

export const validateUploadRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.data && req.body.group) {
    return next();
  }
  return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidUserData });
};
