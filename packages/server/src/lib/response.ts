import { Response } from 'express';

export interface BackendResponse<T> extends Response {
  send: (body: T) => Response;
}
