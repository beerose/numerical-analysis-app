import { apiMessages, GroupDTO, UserResultsDTO } from 'common';
import codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, GetRequest, handleBadRequest } from '../../../lib';
import { db } from '../../../store';

const GetResultsQueryV = t.type({
  group_id: t.string,
});

type GetResultsRequest = GetRequest<typeof GetResultsQueryV>;

export const getResults = (
  req: GetResultsRequest,
  res: BackendResponse<UserResultsDTO[]>
) => {
  handleBadRequest(GetResultsQueryV, req.query, res).then(query => {
    const groupId = Number(query.group_id);
    db.getUsersResults({ groupId }, (err, tasksResults) => {
      if (err) {
        res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
        return;
      }

      db.getTasksMaxPointsPerGroup({ groupId }, (maxErr, [{ max }]) => {
        if (maxErr) {
          res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: maxErr.message,
          });
          return;
        }

        db.getUsersMeetingsPoints(
          { groupId },
          (meetingsErr, meetingsResults) => {
            if (meetingsErr) {
              res.status(codes.INTERNAL_SERVER_ERROR).send({
                error: apiMessages.internalError,
                error_details: meetingsErr.message,
              });
              return;
            }

            const mergedResults = tasksResults.map(tu => {
              const meetingsResult = meetingsResults.find(
                mu => mu.user_id === mu.user_id
              );
              return {
                ...tu,
                presences: meetingsResult ? meetingsResult.sum_presences : 0,
                sum_activity: meetingsResult
                  ? meetingsResult.activity_points
                  : 0,
                max_tasks_grade: max,
              };
            });
            res.status(codes.OK).send(mergedResults);
          }
        );
      });
    });
  });
};
