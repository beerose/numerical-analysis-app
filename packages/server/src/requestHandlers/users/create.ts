import { apiMessages, UserRole } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import {
  BackendResponse,
  handleBadRequest,
  PostRequest,
  sendRegistrationLink as sendStudentActivationLink,
} from '../../lib';
import { db, DUPLICATE_ENTRY_ERROR } from '../../store';

const AddUserV = t.type({
  email: t.string,
  student_index: t.union([t.string, t.undefined]),
  user_name: t.string,
  user_role: t.union([
    t.literal(UserRole.Admin),
    t.literal(UserRole.Student),
    t.literal(UserRole.SuperUser),
  ]),
});

type AddUserRequest = PostRequest<typeof AddUserV>;

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
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }

      return sendStudentActivationLink(user, emailErr => {
        if (emailErr) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.invitationNotSent,
            error_details: emailErr.message,
          });
        }
        return res.status(codes.OK).send({ message: apiMessages.userCreated });
      });
    });
  });
};
