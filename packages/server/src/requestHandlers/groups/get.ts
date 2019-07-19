import { apiMessages, GroupDTO, UserRole } from 'common';
import codes from 'http-status-codes';
import * as t from 'io-ts';
import { promisify } from 'util';

import { BackendResponse, GetRequest, handleBadRequest } from '../../lib';
import { db } from '../../store';
import { listUsersWithGroup } from '../../store/mysql';

const listStudents = promisify(listUsersWithGroup);

const GetGroupQueryV = t.type({
  group_id: t.string,
});

type GetGroupRequest = GetRequest<typeof GetGroupQueryV>;

export const getGroup = (
  req: GetGroupRequest,
  res: BackendResponse<GroupDTO>
) => {
  handleBadRequest(GetGroupQueryV, req.query, res).then(async query => {
    const groupId = Number(query.group_id);

    if (res.locals.user!.user_role === UserRole.Student) {
      const students = await listStudents(groupId);
      if (!students.find(s => s.id === res.locals.user!.id)) {
        return res.status(codes.FORBIDDEN).send({
          error: "group not found or student doesn't belong to the group",
        });
      }
    }

    return db.getGroup({ groupId }, (err, results) => {
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
