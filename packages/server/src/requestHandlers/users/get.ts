import { apiMessages } from 'common';
import * as codes from 'http-status-codes';

import { BackendResponse, GetRequest } from '../../lib';

type GetUserRequest = GetRequest<any>;

// TODO:
// Consider only responding with student data if he's the one who's asking for it.

export const get = (req: GetUserRequest, res: BackendResponse) => {
  console.log('get', `/users/${req.params.id}`);
  return res.status(codes.INTERNAL_SERVER_ERROR).send({
    error: apiMessages.internalError,
    error_details: 'Not implemented yet. Sorry!',
  });
};
