import { apiMessages, UserRole } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, GetRequest, handleBadRequest } from '../../lib';
import { db, DUPLICATE_ENTRY_ERROR } from '../../store';

const UpdateUserBodyV = t.type({
  email: t.string,
  id: t.number,
  student_index: t.union([t.string, t.null, t.undefined]),
  user_name: t.string,
  user_role: t.union([
    t.literal(UserRole.admin),
    t.literal(UserRole.student),
    t.literal(UserRole.superUser),
  ]),
});

type UpdateUserRequest = GetRequest<typeof UpdateUserBodyV>;

export const update = (req: UpdateUserRequest, res: BackendResponse) => {
  handleBadRequest(UpdateUserBodyV, req.body, res).then(() => {
    const user = req.body;
    db.updateUser(user, err => {
      if (err) {
        if (err.code === DUPLICATE_ENTRY_ERROR) {
          return res.status(codes.CONFLICT).send({
            error: apiMessages.userAlreadyExists,
            error_details: err.message,
          });
        }
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }
      return res.status(codes.OK).send({ message: apiMessages.userUpdated });
    });
  });
};
