import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from '../../../../common/apiMessages';
import { db } from '../../store';

interface DeleteMeetingRequest extends Request {
  body: {
    meeting: {
      meeting_name: string;
      date: string;
    };
    group_id: string;
  };
}
export const deleteMeeting = (req: DeleteMeetingRequest, res: Response) => {
  const { group_id } = req.body;

  db.deleteMeeting({ groupId: group_id }, err => {
    if (err) {
      console.error(err);
      res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      return;
    }
    res.status(codes.OK).send({ message: apiMessages.meetingDeleted });
  });
};
