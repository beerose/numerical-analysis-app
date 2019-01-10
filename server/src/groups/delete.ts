import { apiMessages } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { db } from '../store';

interface DeleteGroupRequest extends Request {
  body: {
    group_id: string;
  };
}
export const deleteGroup = (req: DeleteGroupRequest, res: Response) => {
  const { group_id } = req.body;

  db.deleteGroup({ groupId: group_id }, err => {
    if (err) {
      console.error(err);
      res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError });
      return;
    }
    res.status(codes.OK).send({ message: apiMessages.groupDeleted });
  });
};
