import { apiMessages, MeetingDTO, UserDTO } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../../lib/request';
import { db } from '../../store';

const SetActivityBodyV = t.type({
  meeting_id: t.number,
  points: t.number,
  student_id: t.number,
});

type SetActivityRequest = PostRequest<typeof SetActivityBodyV>;

export const setActivity = (req: SetActivityRequest, res: Response) => {
  handleBadRequest(SetActivityBodyV, req.body, res).then(() => {
    const { meeting_id, student_id, points } = req.body;

    db.setActivity(
      { points, userId: student_id, meetingId: meeting_id },
      err => {
        if (err) {
          console.error(err);
          res
            .status(codes.INTERNAL_SERVER_ERROR)
            .send({ error: apiMessages.internalError });
          return;
        }
        res.status(codes.OK).send({ message: apiMessages.activitySet });
      }
    );
  });
};
