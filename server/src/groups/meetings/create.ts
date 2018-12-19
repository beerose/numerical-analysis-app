import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from '../../../../common/apiMessages';
import { db } from '../../store';

interface AddMeetingRequest extends Request {
  body: {
    meeting: {
      meeting_name: string;
      date: string;
    };
    group_id: string;
  };
}
export const addMeeting = (req: AddMeetingRequest, res: Response) => {
  const {
    group_id,
    meeting: { meeting_name, date },
  } = req.body;

  const parsedDate = new Date(date);
  db.addMeeting({ date: parsedDate, name: meeting_name, groupId: group_id }, err => {
    if (err) {
      console.error(err);
      res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      return;
    }
    res.status(codes.OK).send({ message: apiMessages.meetingCreated });
  });
};
