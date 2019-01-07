import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { GroupDTO } from 'common';
import { apiMessages } from 'common';
import { db } from '../store';

interface CreateGroupRequest extends Request {
  body: GroupDTO;
}
export const create = (req: CreateGroupRequest, res: Response) => {
  const group = req.body;

  db.addGroup(group, (err, result) => {
    if (err) {
      console.error({ err });
      return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
    }

    return res
      .status(codes.OK)
      .send({ message: apiMessages.groupCreated, group_id: result.insertId });
  });
};
