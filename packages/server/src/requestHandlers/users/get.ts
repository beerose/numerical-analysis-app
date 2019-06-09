import { apiMessages, UserDTO } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types/lib/number/NumberFromString';

import { BackendResponse, GetRequest, handleBadRequest } from '../../lib';
import { db } from '../../store';

// TODO:
// Consider only responding with student data if he's the one who's asking for it.
/*
  allow if
  - student is asking for lecturer info
  - student is asking for his own info (params.id matches token?)
  - lecturer is asking for anything

  TODO: Add tests for this
*/

const GetUserV = t.type({
  id: NumberFromString,
});

type GetUserRequest = GetRequest<any, typeof GetUserV>;

export const get = (req: GetUserRequest, res: BackendResponse<UserDTO>) => {
  handleBadRequest(GetUserV, req.params, res).then(({ id }) =>
    db.getUser(id, (dbError, [user]) => {
      if (dbError) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: dbError.message,
        });
      }

      if (!user) {
        return res.status(codes.NOT_FOUND).send({
          error: apiMessages.userNotFound,
        });
      }

      delete user.password;
      return res.status(codes.OK).send(user);
    })
  );
};
