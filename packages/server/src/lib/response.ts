import { Response } from 'express';

import { ApiResponse } from '../../../../dist/common';

export interface BackendResponse<T = ApiResponse> extends Response {
  send: (body: T) => Response;
}
