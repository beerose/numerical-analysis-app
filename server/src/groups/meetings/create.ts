import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from '../../../../common/apiMessages';
import { db } from '../../store';

interface AddMeetingRequest extends Request {
  body: {
    meeting_name: string;
    date: Date;
    group_id: string;
  };
}
export const addMeeting = (req: AddMeetingRequest, res: Response) => {
  const { meeting_name, date, group_id } = req.body;
  db.addMeeting({ date, name: meeting_name, groupId: group_id }, err => {
    console.log({ date, name: meeting_name, groupId: group_id });
    if (err) {
      console.error(err);
      res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      return;
    }
    res.status(codes.OK).send({ message: apiMessages.meetingCreated });
  });
};
