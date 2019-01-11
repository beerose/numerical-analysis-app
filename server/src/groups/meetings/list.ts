import { GroupDTO } from 'common';
import { apiMessages } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { db } from '../../store';

interface ListMeetingsOfGroupRequest extends Request {
  query: {
    group_id: GroupDTO['id'];
  };
}
export const listMeetings = (
  req: ListMeetingsOfGroupRequest,
  res: Response
) => {
  return db.listMeetings(req.query.group_id, (error, result) => {
    if (error) {
      console.error('listMeetings error:', error);
      res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError });
      return;
    }
    console.log({ result });
    res.status(codes.OK).send(result);
  });
};
