import { UserWithGroups } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types/lib/NumberFromString';

import { BackendResponse, GetRequest, handleBadRequest } from '../../../lib';
import { db } from '../../../store';

const GetStudentWithGroupRequestV = t.type({
  params: t.type({
    id: NumberFromString,
  }),
  query: t.type({
    groupId: NumberFromString,
  }),
});

type GetStudentWithGroupRequest = GetRequest<
  typeof GetStudentWithGroupRequestV
>;

export const getStudentWithGroup = (
  req: GetStudentWithGroupRequest,
  res: BackendResponse<{ studentWithGroup: UserWithGroups }>
) => {
  handleBadRequest(
    GetStudentWithGroupRequestV,
    { query: req.query, params: req.params },
    res
  ).then(({ query, params }) => {
    db.getStudentWithGroup(
      { groupId: query.groupId, userId: params.id },
      (dbErr, dbRes) => {
        if (dbErr) {
          return res.internalError(dbErr);
        }

        return res.status(codes.OK).send({
          studentWithGroup: dbRes.map(s => ({
            ...s,
            group_ids: s.group_ids ? s.group_ids.split(',').map(Number) : [],
            groups_grades: s.groups_grades && JSON.parse(s.groups_grades),
          }))[0],
        });
      }
    );
  });
};
