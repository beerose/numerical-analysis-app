import { apiMessages, UserRole } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../../lib/request';
import { connection } from '../../store/connection';
import {
  prepareAttachStudentToGroupQuery,
  upsertUserQuery,
} from '../../store/queries';

const AddStudentToGroupBodyV = t.type({
  group_id: t.string,
  user: t.type({
    email: t.string,
    id: t.number,
    student_index: t.union([t.string, t.null, t.undefined]),
    user_name: t.string,
    user_role: t.union([
      t.literal(UserRole.admin),
      t.literal(UserRole.student),
      t.literal(UserRole.superUser),
    ]),
  }),
});

type AddStudentToGroupRequest = PostRequest<typeof AddStudentToGroupBodyV>;

export const addStudentToGroup = (
  req: AddStudentToGroupRequest,
  res: Response
) => {
  handleBadRequest(AddStudentToGroupBodyV, req.body, res).then(() => {
    const { user, group_id } = req.body;
    connection.query(
      {
        sql: upsertUserQuery,
        values: [
          [[user.user_name, user.email, UserRole.student, user.student_index]],
        ],
      },
      upsertErr => {
        if (upsertErr) {
          console.error({ upsertErr });
          res
            .status(codes.INTERNAL_SERVER_ERROR)
            .send({ error: apiMessages.internalError });
          return;
        }
        const attachQuery = prepareAttachStudentToGroupQuery(
          [user.email],
          group_id
        );
        connection.query(
          {
            sql: attachQuery,
          },
          attachErr => {
            if (attachErr) {
              console.error({ attachErr });
              res
                .status(codes.INTERNAL_SERVER_ERROR)
                .send({ error: apiMessages.internalError });
              return;
            }
            return res
              .status(codes.OK)
              .send({ message: apiMessages.userCreated });
          }
        );
      }
    );
  });
};
