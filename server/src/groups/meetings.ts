import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import { addMeetingQuery } from '../store/queries';

interface AddMeetingRequest extends Request {
  body: {
    meeting_name: string;
    date: Date;
    group_id: number;
  };
}
export const addMeeting = (req: AddMeetingRequest, res: Response) => {
  const { meeting_name, date, group_id } = req.body;
  connection.query(
    {
      sql: addMeetingQuery,
      values: [meeting_name, date, group_id],
    },
    err => {
      const newDate = new Date();
      if (err) {
        console.error(err);
        res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
        return;
      }
      res.status(codes.OK).send({ message: apiMessages.meetingCreated });
    }
  );
};
