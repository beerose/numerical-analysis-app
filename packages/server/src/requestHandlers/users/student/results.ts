import { apiMessages, GroupDTO, isUserId } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types/lib/number/NumberFromString';

import { BackendResponse, GetRequest, handleBadRequest } from '../../../lib';
import { db } from '../../../store';

const GetStudentResultsV = t.type({
  params: t.type({
    id: NumberFromString,
  }),
  query: t.type({
    groupId: NumberFromString,
  }),
});

type GetStudentResults = GetRequest<typeof GetStudentResultsV>;

export const results = (
  req: GetStudentResults,
  res: BackendResponse<{ groups: GroupDTO[] }>
) => {
  handleBadRequest(
    GetStudentResultsV,
    { query: req.query, params: req.params },
    res
  ).then(() => {
    // return db.getStudentGroups({ userId: req.params.id }, (dbErr, dbRes) => {
    //   if (dbErr) {
    //     return res.status(codes.INTERNAL_SERVER_ERROR).send({
    //       error: apiMessages.internalError,
    //       error_details: dbErr.message,
    //     });
    //   }
    //   return res.status(codes.OK).send({
    //     groups: dbRes,
    //   });
    // });
  });
};
