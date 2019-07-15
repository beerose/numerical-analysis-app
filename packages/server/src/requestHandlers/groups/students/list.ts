import { apiMessages, UserWithGroups } from 'common';
import { Request } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types/lib/NumberFromString';

import { BackendResponse, GetRequest, handleBadRequest } from '../../../lib';
import { db } from '../../../store';

const ListStudentsWithinGroupQueryV = t.type({
  groupId: NumberFromString,
});

type ListStudentsWithinGroupRequest = GetRequest<
  typeof ListStudentsWithinGroupQueryV
>;

export const listStudentsWithinGroup = (
  req: ListStudentsWithinGroupRequest,
  res: BackendResponse<{ students: UserWithGroups[] }>
) => {
  return handleBadRequest(ListStudentsWithinGroupQueryV, req.query, res).then(
    ({ groupId }) => {
      return db.listUsersWithGroup(groupId, (err, students) => {
        if (err) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        }
        return res.status(codes.OK).send({
          students: students.map(s => ({
            ...s,
            group_ids: s.group_ids ? s.group_ids.split(',').map(Number) : [],
            groups_grades: s.groups_grades && JSON.parse(s.groups_grades),
          })),
        });
      });
    }
  );
};
