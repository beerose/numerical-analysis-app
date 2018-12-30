import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { GroupDTO } from '../../../../common/api';
import { apiMessages } from '../../../../common/apiMessages';
import { db } from '../../store';

interface GetMeetingsDetailsRequest extends Request {
  query: {
    group_id: GroupDTO['id'];
  };
}

export const getMeetingsDetails = (req: GetMeetingsDetailsRequest, res: Response) => {
  const { group_id } = req.query;
  db.getPresencesInGroup({ groupId: group_id }, (err, results) => {
    if (err) {
      console.error(err);
      res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
    }
    console.log(results);
    res.status(codes.OK).send({ results });
  });
};
