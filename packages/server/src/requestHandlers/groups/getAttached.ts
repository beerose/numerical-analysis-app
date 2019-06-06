import { apiMessages, GroupDTO } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, GetRequest, handleBadRequest } from '../../lib';
import { db } from '../../store';

const GetAttachedQueryV = t.type({
  group_id: t.string,
});

type GetAttachedRequest = GetRequest<typeof GetAttachedQueryV>;

export const getAttached = (
  req: GetAttachedRequest,
  res: BackendResponse<{ groups: GroupDTO[] }>
) =>
  handleBadRequest(GetAttachedQueryV, req.query, res).then(() => {
    db.getAttachedGroups(
      {
        groupId: Number(req.query.group_id),
      },
      (err, groups) => {
        if (err) {
          res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        }

        res.status(codes.OK).send({ groups });
      }
    );
  });
