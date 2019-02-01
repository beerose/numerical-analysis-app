import { apiMessages, UserRole } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../lib/request';
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

export const create = (req: AddUserRequest, res: Response) => {
  handleBadRequest(AddUserV, req.body, res).then(() => {
    const user = req.body;
    db.addUser(user, error => {
      if (error) {
        switch (error.code) {
          case DUPLICATE_ENTRY_ERROR:
            return res.status(codes.CONFLICT).send({
              error: apiMessages.userAlreadyExists,
            });
          default:
            return res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
        }
      }
      return res.status(codes.OK).send({ message: apiMessages.userCreated });
    });
  });
};
