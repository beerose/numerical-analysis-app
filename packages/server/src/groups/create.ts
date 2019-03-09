import { apiMessages, ApiResponse, GroupType } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../lib/request';
import { BackendResponse } from '../lib/response';
import { db } from '../store';

const CreateGroupBodyV = t.type({
  group_name: t.string,
  group_type: t.union([
    t.literal(GroupType.Exercise),
    t.literal(GroupType.Lab),
    t.literal(GroupType.Lecture),
  ]),
  lecturer_id: t.number,
  semester: t.string,
});

type CreateGroupRequest = PostRequest<typeof CreateGroupBodyV>;

export const create = (
  req: CreateGroupRequest,
  res: BackendResponse<ApiResponse | { group_id: string }>
) => {
  handleBadRequest(CreateGroupBodyV, req.body, res).then(() => {
    const group = req.body;

    db.addGroup(group, (err, result) => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }

      return res
        .status(codes.OK)
        .send({ message: apiMessages.groupCreated, group_id: result.insertId });
    });
  });
};
