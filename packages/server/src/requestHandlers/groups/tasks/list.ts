import { apiMessages, TaskDTO } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, GetRequest, handleBadRequest } from '../../../lib';
import { db } from '../../../store';

const ListTasksQueryV = t.type({
  group_id: t.union([t.string, t.undefined]),
});

type ListTasksRequest = GetRequest<typeof ListTasksQueryV>;

export const listTasksForGroup = (
  req: ListTasksRequest,
  res: BackendResponse<{ tasks: TaskDTO[] }>
) => {
  handleBadRequest(ListTasksQueryV, req.query, res).then(() => {
    return db.listTasksForGroup(
      { groupId: req.query.group_id ? Number(req.query.group_id) : undefined },
      (err, tasks) => {
        if (err) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        }
        return res.status(codes.OK).send({ tasks });
      }
    );
  });
};
