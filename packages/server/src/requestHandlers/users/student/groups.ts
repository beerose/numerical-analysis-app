import { apiMessages, GroupDTO, isUserId } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types/lib/NumberFromString';

import { BackendResponse, GetRequest, handleBadRequest } from '../../../lib';
import { db } from '../../../store';

const GetStudentGroupsParamsV = t.type({
  id: NumberFromString,
});

type GetStudentGroups = GetRequest<t.Any, typeof GetStudentGroupsParamsV>;

export const groups = (
  req: GetStudentGroups,
  res: BackendResponse<{ groups: GroupDTO[] }>
) => {
  handleBadRequest(GetStudentGroupsParamsV, req.params, res).then(() => {
    return db.getStudentGroups({ userId: req.params.id }, (dbErr, dbRes) => {
      if (dbErr) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: dbErr.message,
        });
      }

      return res.status(codes.OK).send({
        groups: dbRes,
      });
    });
  });
};
