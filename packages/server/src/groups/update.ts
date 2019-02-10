import { apiMessages, GroupType } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../lib/request';
import { db } from '../store';

const UpdateGroupBodyV = t.type({
  academic_year: t.union([t.string, t.undefined]),
  grade_equation: t.union([t.string, t.undefined]),
  group_name: t.string,
  group_type: t.union([
    t.literal(GroupType.Exercise),
    t.literal(GroupType.Lab),
    t.literal(GroupType.Lecture),
  ]),
  id: t.number,
  lecturer_id: t.number,
  tresholds: t.union([
    t.type({
      '3': t.number,
      '3.5': t.number,
      '4': t.number,
      '4.5': t.number,
      '5': t.number,
    }),
    t.undefined,
  ]),
});

type UpdateGroupBody = PostRequest<typeof UpdateGroupBodyV>;

export const update = (req: UpdateGroupBody, res: Response) => {
  handleBadRequest(UpdateGroupBodyV, req.body, res).then(() => {
    const group = req.body;
    const data = {
      grade_equation: group.grade_equation,
      tresholds: group.tresholds,
    };

    db.updateGroup({ ...group, data }, err => {
      if (err) {
        console.error({ err });
        return res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
      }

      return res.status(codes.OK).send({ message: apiMessages.groupUpdated });
    });
  });
};
