import { apiMessages, GroupDTO } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types/lib/NumberFromString';

import { BackendResponse, GetRequest, handleBadRequest } from '../../lib';
import { db } from '../../store';

const ListGroupsQueryV = t.partial({
  lecturer_id: NumberFromString,
});

type ListGroupsRequest = GetRequest<typeof ListGroupsQueryV>;

export const list = (
  req: ListGroupsRequest,
  res: BackendResponse<{ groups: GroupDTO[] }>
) =>
  handleBadRequest(ListGroupsQueryV, req.query, res).then(() => {
    return db.listGroups(
      { lecturerId: req.query.lecturer_id },
      (err, groups) => {
        if (err) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        }
        return res.status(codes.OK).send({ groups });
      }
    );
  });
