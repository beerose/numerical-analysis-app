import { apiMessages, UserRole } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../../lib/request';
import { BackendResponse } from '../../lib/response';
import { db } from '../../store';

const AddStudentToGroupBodyV = t.type({
  group_id: t.number,
  user: t.type({
    email: t.string,
    student_index: t.union([t.string, t.undefined]),
    user_name: t.string,
  }),
});

type AddStudentToGroupRequest = PostRequest<typeof AddStudentToGroupBodyV>;

export const addStudentToGroup = (
  req: AddStudentToGroupRequest,
  res: BackendResponse
) => {
  handleBadRequest(AddStudentToGroupBodyV, req.body, res).then(() => {
    const { user, group_id } = req.body;
    db.upsertUser({ ...user, user_role: UserRole.student }, upsertErr => {
      if (upsertErr) {
        res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: upsertErr.message,
        });
        return;
      }
      db.attachStudentToGroup(
        { email: user.email, groupId: group_id },
        attachErr => {
          if (attachErr) {
            res.status(codes.INTERNAL_SERVER_ERROR).send({
              error: apiMessages.internalError,
              error_details: attachErr.message,
            });
            return;
          }
          return res
            .status(codes.OK)
            .send({ message: apiMessages.userCreated });
        }
      );
    });
  });
};
