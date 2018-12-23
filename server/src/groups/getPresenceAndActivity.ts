import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { GroupDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';

interface GetPresenceAndAcitivtyRequest extends Request {
  query: {
    group_id: GroupDTO['id'];
  };
}

export const getPresenceAndActivity = (req: Request, res: Response) => {};

