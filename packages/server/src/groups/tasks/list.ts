import { apiMessages } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../../lib/request';
import { db } from '../../store';

const ListTasksQueryV = t.type({
  group_id: t.number,
});

type ListTasksRequest = GetRequest<typeof ListTasksQueryV>;

export const listTasksForGroup = (req: ListTasksRequest, res: Response) => {
  handleBadRequest(ListTasksQueryV, req.query, res).then(() => {
    return db.listTasksForGroup(
      { groupId: req.query.group_id },
      (err, tasks) => {
        if (err) {
          return res
            .status(codes.INTERNAL_SERVER_ERROR)
            .send({
              error: apiMessages.internalError,
              error_details: err.message,
            });
        }
        return res.status(codes.OK).send({ tasks });
      }
    );
  });
};
