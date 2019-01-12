import { apiMessages } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../../lib/request';
import { db } from '../../store';

const DeleteMeetingBodyV = t.type({
  meeting_id: t.number,
});

type DeleteMeetingRequest = PostRequest<typeof DeleteMeetingBodyV>;

export const deleteMeeting = (req: DeleteMeetingRequest, res: Response) => {
  handleBadRequest(DeleteMeetingBodyV, req.body, res).then(() => {
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
  });
};
