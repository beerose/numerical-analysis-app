import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../../lib';
import { db } from '../../../store';

const AddMeetingBodyV = t.type({
  group_id: t.number,
  meeting: t.type({ meeting_name: t.string, date: t.string }),
});

type AddMeetingRequest = PostRequest<typeof AddMeetingBodyV>;

export const addMeeting = (req: AddMeetingRequest, res: BackendResponse) => {
  handleBadRequest(AddMeetingBodyV, req.body, res).then(() => {
    const {
      group_id,
      meeting: { meeting_name, date },
    } = req.body;

    const parsedDate = new Date(date);
    db.addMeeting(
      { date: parsedDate, name: meeting_name, groupId: group_id },
      err => {
        if (err) {
          res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
          return;
        }
        res.status(codes.OK).send({ message: apiMessages.meetingCreated });
      }
    );
  });
};
