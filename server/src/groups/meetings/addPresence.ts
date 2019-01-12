import { apiMessages } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../../lib/request';
import { db } from '../../store';

const AddPresenceBodyV = t.type({
  meeting_id: t.number,
  student_id: t.number,
});

type AddPresenceRequest = PostRequest<typeof AddPresenceBodyV>;

export const addPresence = (req: AddPresenceRequest, res: Response) => {
  handleBadRequest(AddPresenceBodyV, req.body, res).then(() => {
    const { meeting_id, student_id } = req.body;

    db.addPresence({ userId: student_id, meetingId: meeting_id }, err => {
      if (err) {
        console.error(err);
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
        return;
      }
      res.status(codes.OK).send({ message: apiMessages.presenceAdded });
    });
  });
};
