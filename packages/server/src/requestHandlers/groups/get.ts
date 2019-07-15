import { apiMessages, GroupDTO } from 'common';
import codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, GetRequest, handleBadRequest } from '../../lib';
import { db } from '../../store';

const GetGroupQueryV = t.type({
  group_id: t.string,
});

type GetGroupRequest = GetRequest<typeof GetGroupQueryV>;

export const getGroup = (
  req: GetGroupRequest,
  res: BackendResponse<GroupDTO>
) => {

  handleBadRequest(GetGroupQueryV, req.query, res).then(query => {
    db.getGroup({ groupId: Number(query.group_id) }, (err, results) => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }

      const group = results[0];
      if (!group) {
        return res
          .status(codes.NOT_FOUND)
          .send({ error: apiMessages.groupMissing });
      }

      (group as GroupDTO).data = JSON.parse(group.data);

      return res.status(codes.OK).send(group);
    });
  });
};
