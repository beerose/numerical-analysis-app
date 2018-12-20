import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { GroupDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import { addGroupQuery } from '../store/queries';

interface CreateGroupRequest extends Request {
  body: GroupDTO;
}

export const create = (req: CreateGroupRequest, res: Response) => {
  const group = req.body;

  console.log({ group });

  connection.query(
    {
      sql: addGroupQuery,
      values: [group.group_name, group.group_type, group.class, group.academic_year],
    },
    (err, queryResult) => {
      if (err) {
        console.error({ err });
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }

      console.log('inserted group:', { abcd: queryResult });

      return res.status(codes.OK).send({ message: apiMessages.groupCreated });
    }
  );
};
