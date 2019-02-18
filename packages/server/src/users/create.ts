import { apiMessages, UserRole } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../lib/request';
import { BackendResponse } from '../lib/response';
import { db } from '../store';
import { DUPLICATE_ENTRY_ERROR } from '../store/connection';

const AddUserV = t.type({
  email: t.string,
  student_index: t.union([t.string, t.undefined]),
  user_name: t.string,
  user_role: t.union([
    t.literal(UserRole.admin),
    t.literal(UserRole.student),
    t.literal(UserRole.superUser),
  ]),
});

type AddUserRequest = GetRequest<typeof AddUserV>;

export const create = (req: AddUserRequest, res: BackendResponse) => {
  handleBadRequest(AddUserV, req.body, res).then(() => {
    const user = req.body;
    db.addUser(user, err => {
      if (err) {
        if (err.code === DUPLICATE_ENTRY_ERROR) {
          return res.status(codes.CONFLICT).send({
            error: apiMessages.userAlreadyExists,
            error_details: err.message,
          });
        }
        return res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
      }
      return res.status(codes.OK).send({ message: apiMessages.userCreated });
    });
  });
};
