import { apiMessages } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { PostRequest } from '../../lib/request';
import { db } from '../../store';

const UpdateMeetingBodyV = t.type({
  meeting: t.type({
    date: t.string,
    id: t.number,
    meeting_name: t.string,
  }),
});

type UpdateMeetingRequest = PostRequest<typeof UpdateMeetingBodyV>;

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
