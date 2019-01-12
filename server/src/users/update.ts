import { apiMessages, UserRole } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../lib/request';
import { db } from '../store';
import { DUPLICATE_ENTRY_ERROR } from '../store/connection';

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

export const update = (req: UpdateUserRequest, res: Response) => {
  handleBadRequest(UpdateUserBodyV, req.body, res).then(() => {
    const user = req.body;
    db.updateUser(user, error => {
      if (error) {
        switch (error.code) {
          case DUPLICATE_ENTRY_ERROR:
            return res
              .status(codes.CONFLICT)
              .send({ error: apiMessages.userAlreadyExists });
          default:
            return res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
        }
      }
      return res.status(codes.OK).send({ message: apiMessages.userUpdated });
    });
  });
};
