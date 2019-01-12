import { apiMessages } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../lib/request';
import { db } from '../store';

const GetGroupQueryV = t.type({
  group_id: t.string,
});

type GetGroupRequest = GetRequest<typeof GetGroupQueryV>;

export const get = (req: GetGroupRequest, res: Response) => {
  handleBadRequest(GetGroupQueryV, req.query, res).then(query => {
    db.getGroup({ groupId: Number(query.group_id) }, (mysqlErr, [group]) => {
      if (mysqlErr) {
        console.error(mysqlErr);
        return res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
      }

      if (!group) {
        return res
          .status(codes.NOT_FOUND)
          .send({ error: apiMessages.groupMissing });
      }

      return res.status(codes.OK).send(group);
    });
  });
};
