import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../../lib/request';
import { BackendResponse } from '../../lib/response';
import { db } from '../../store';

const DeleteMeetingBodyV = t.type({
  meeting_id: t.number,
});

type DeleteMeetingRequest = PostRequest<typeof DeleteMeetingBodyV>;

export const deleteMeeting = (
  req: DeleteMeetingRequest,
  res: BackendResponse
) => {
  handleBadRequest(DeleteMeetingBodyV, req.body, res).then(() => {
    const { meeting_id } = req.body;

    db.deleteMeeting({ meetingId: meeting_id }, err => {
      if (err) {
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({
            error: apiMessages.internalError,
            errorDetails: err.message,
          });
        return;
      }
      res.status(codes.OK).send({ message: apiMessages.meetingDeleted });
    });
  });
};
