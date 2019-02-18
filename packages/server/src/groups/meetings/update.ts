import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { PostRequest } from '../../lib/request';
import { BackendResponse } from '../../lib/response';
import { db } from '../../store';

const UpdateMeetingBodyV = t.type({
  meeting: t.type({
    date: t.string,
    id: t.number,
    meeting_name: t.string,
  }),
});

type UpdateMeetingRequest = PostRequest<typeof UpdateMeetingBodyV>;

export const updateMeeting = (
  req: UpdateMeetingRequest,
  res: BackendResponse
) => {
  const {
    meeting: { meeting_name, date, id },
  } = req.body;

  const parsedDate = new Date(date);
  db.updateMeeting({ id, name: meeting_name, date: parsedDate }, err => {
    if (err) {
      res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError, error_details: err.message });
      return;
    }
    res.status(codes.OK).send({ message: apiMessages.meetingUpdated });
  });
};
