import { apiMessages, GroupType } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../lib/request';
import { db } from '../store';

const CreateGroupBodyV = t.type({
  academic_year: t.union([t.string, t.undefined]),
  group_name: t.string,
  group_type: t.union([
    t.literal(GroupType.Exercise),
    t.literal(GroupType.Lab),
    t.literal(GroupType.Lecture),
  ]),
});

type CreateGroupRequest = PostRequest<typeof CreateGroupBodyV>;

export const create = (req: CreateGroupRequest, res: Response) => {
  handleBadRequest(CreateGroupBodyV, req.body, res).then(() => {
    const group = req.body;

    db.addGroup(group, (err, result) => {
      if (err) {
        console.error({ err });
        return res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
      }

      return res
        .status(codes.OK)
        .send({ message: apiMessages.groupCreated, group_id: result.insertId });
    });
  });
};
