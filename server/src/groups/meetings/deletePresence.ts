import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { MeetingDTO, UserDTO } from '../../../../common/api';
import { apiMessages } from '../../../../common/apiMessages';
import { db } from '../../store';

interface DeletePresenceRequest extends Request {
  body: {
    meeting_id: MeetingDTO['id'];
    user_id: UserDTO['id'];
  };
}
export const deletePresence = (req: DeletePresenceRequest, res: Response) => {
  const { meeting_id, user_id } = req.body;

  db.deletePresence({ userId: user_id, meetingId: meeting_id }, err => {
    if (err) {
      console.error(err);
      res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      return;
    }
    res.status(codes.OK).send({ message: apiMessages.presenceDeleted });
  });
};
