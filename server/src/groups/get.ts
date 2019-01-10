import { apiMessages, GroupDTO } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { db } from '../store';

interface GetGroupRequest extends Request {
  query: {
    group_id: GroupDTO['id'];
  };
}

export const get = (req: GetGroupRequest, res: Response) => {
  return db.getGroup({ groupId: req.query.group_id }, (err, [group]) => {
    if (err) {
      console.log(err);
      return res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError });
    }
    return res.status(codes.OK).send(group);
  });
};
