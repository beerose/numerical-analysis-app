import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { UserDTO } from '../../../../common/api';
import { apiMessages } from '../../../../common/apiMessages';
import { ROLES } from '../../../../common/roles';
import { connection } from '../../store/connection';
import { prepareAttachStudentToGroupQuery, upsertUserQuery } from '../../store/queries';

interface AddStudentToGroupRequest extends Request {
  body: {
    user: UserDTO;
    group_id: string;
  };
}
export const addStudentToGroup = (req: AddStudentToGroupRequest, res: Response) => {
  const { user, group_id } = req.body;
  connection.query(
    {
      sql: upsertUserQuery,
      values: [[[user.user_name, user.email, ROLES.student, user.student_index]]],
    },
    upsertErr => {
      if (upsertErr) {
        console.error({ upsertErr });
        res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
        return;
      }
      const attachQuery = prepareAttachStudentToGroupQuery([user.email], group_id);
      connection.query(
        {
          sql: attachQuery,
        },
        attachErr => {
          if (attachErr) {
            console.error({ attachErr });
            res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
            return;
          }
          return res.status(codes.OK).send({ message: apiMessages.userCreated });
        }
      );
    }
  );
};
