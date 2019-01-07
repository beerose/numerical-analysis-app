import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { MeetingDTO } from 'common';
import { apiMessages } from 'common';
import { db } from '../../store';

interface UpdateMeetingRequest extends Request {
  body: {
    meeting: Pick<MeetingDTO, 'id' | 'meeting_name' | 'date'>;
  };
}
export const updateMeeting = (req: UpdateMeetingRequest, res: Response) => {
  const {
    meeting: { meeting_name, date, id },
  } = req.body;

  const parsedDate = new Date(date);
  db.updateMeeting({ id, name: meeting_name, date: parsedDate }, err => {
    if (err) {
      console.error(err);
      res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError });
      return;
    }
    res.status(codes.OK).send({ message: apiMessages.meetingUpdated });
  });
};
