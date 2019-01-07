import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from 'common';
import { db } from '../../store';

interface DeleteMeetingRequest extends Request {
  body: {
    meeting_id: string;
  };
}
export const deleteMeeting = (req: DeleteMeetingRequest, res: Response) => {
  const { meeting_id } = req.body;

  db.deleteMeeting({ meetingId: meeting_id }, err => {
    if (err) {
      console.error(err);
      res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError });
      return;
    }
    res.status(codes.OK).send({ message: apiMessages.meetingDeleted });
  });
};
