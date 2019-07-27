import { apiMessages, UserResultsDTO, UserRole } from 'common';
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
    const user = res.locals.user;

    if (!user) {
      res.status(codes.UNAUTHORIZED).send({
        error: apiMessages.invalidRequest,
      });
      return;
    }
    const userId = user.user_role === UserRole.Student ? user.id : undefined;

    db.getUsersTaskPoints({ groupId, userId }, (err, tasksResults) => {
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
                mu => mu.user_id === tu.user_id
              );

              return {
                ...tu,
                max_tasks_grade: max,
                presences: meetingsResult ? meetingsResult.sum_presences : 0,
                sum_activity: meetingsResult
                  ? meetingsResult.activity_points
                  : 0,
                tasks_grade: tu.tasks_grade ? tu.tasks_grade : 0,
              };
            });
            res.status(codes.OK).send(mergedResults);
          }
        );
      });
    });
  });
};
