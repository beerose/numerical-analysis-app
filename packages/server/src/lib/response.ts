import { Response } from 'express';

import { ApiResponse } from '../../../../dist/common';

export interface BackendResponse<T = ApiResponse> extends Response {
  status: (status: number) => BackendResponse<T | ApiResponse>;
  send: (body: T | ApiResponse) => BackendResponse<T | ApiResponse>;
}
