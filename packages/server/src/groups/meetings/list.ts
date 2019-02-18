import { apiMessages, MeetingDTO } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../../lib/request';
import { BackendResponse } from '../../lib/response';
import { db } from '../../store';

const ListMeetingsOfGroupQueryV = t.type({
  group_id: t.string,
});

type ListMeetingsOfGroupRequest = GetRequest<typeof ListMeetingsOfGroupQueryV>;

export const listMeetings = (
  req: ListMeetingsOfGroupRequest,
  res: BackendResponse<MeetingDTO[]>
) =>
  handleBadRequest(ListMeetingsOfGroupQueryV, req.query, res).then(() =>
    db.listMeetings(Number(req.query.group_id), (error, result) => {
      if (error) {
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
        return;
      }
      res.status(codes.OK).send(result);
    })
  );
