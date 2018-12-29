import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { GroupDTO, MeetingDTO } from '../../../../common/api';
import { apiMessages } from '../../../../common/apiMessages';

interface GetPresenceAndAcitivtyRequest extends Request {
  query: {
    meeting_id: MeetingDTO['id'];
  };
}

export const getPresenceAndActivity = (req: Request, res: Response) => {};
