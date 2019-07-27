import { apiMessages } from 'common';
import { RequestHandler, Response } from 'express';
import * as codes from 'http-status-codes';

type ErrorLike = { message: string };

const funcs = {
  internalError(this: Response, error: ErrorLike) {
    return this.status(codes.INTERNAL_SERVER_ERROR).send({
      error: apiMessages.internalError,
      error_details: error.message,
    });
  },
};

export const enhanceResponse: RequestHandler = (_, res, next) => {
  Object.assign(res, funcs);
  next();
};

declare module 'express-serve-static-core' {
  interface Response {
    internalError(msg: ErrorLike): void;
  }
}
