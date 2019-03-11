import { apiMessages, GroupType } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../lib';
import { db } from '../../store';

const UpdateGroupBodyV = t.type({
  academic_year: t.union([t.string, t.undefined]),
  data: t.type({
    grade_equation: t.union([t.string, t.undefined]),
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
  }),
  group_name: t.string,
  group_type: t.union([
    t.literal(GroupType.Exercise),
    t.literal(GroupType.Lab),
    t.literal(GroupType.Lecture),
  ]),
  id: t.number,
  lecturer_id: t.number,
});

type UpdateGroupBody = PostRequest<typeof UpdateGroupBodyV>;

export const update = (req: UpdateGroupBody, res: BackendResponse) => {
  handleBadRequest(UpdateGroupBodyV, req.body, res).then(() => {
    const group = req.body;

    db.updateGroup(group, err => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }

      return res.status(codes.OK).send({ message: apiMessages.groupUpdated });
    });
  });
};
