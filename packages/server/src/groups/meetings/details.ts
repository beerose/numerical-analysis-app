import {
  apiMessages,
  MeetingDetailsDTO,
  Student,
  StudentActivities,
} from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../../lib/request';
import { BackendResponse } from '../../lib/response';
import { db } from '../../store';

const GetMeetingsDetailsQueryV = t.type({
  group_id: t.string,
});

type GetMeetingsDetailsRequest = GetRequest<typeof GetMeetingsDetailsQueryV>;

export const getMeetingsDetails = (
  req: GetMeetingsDetailsRequest,
  res: BackendResponse<{ details: MeetingDetailsDTO[] }>
) => {
  handleBadRequest(GetMeetingsDetailsQueryV, req.query, res).then(() => {
    const { group_id } = req.query;
    db.getPresencesInGroup({ groupId: Number(group_id) }, (err, presences) => {
      if (err) {
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({
            error: apiMessages.internalError,
            errorDetails: err.message,
          });
      }
      db.getActivitiesInGroup(
        { groupId: Number(group_id) },
        (activitiesErr, activities) => {
          if (activitiesErr) {
            res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({
                error: apiMessages.internalError,
                errorDetails: activitiesErr.message,
              });
          }
          const details = presences.map(item => ({
            data: {
              activities: activities
                .filter(a => a.id === item.id)
                .reduce(
                  (result, a) => {
                    result[a.meeting_id] = parseInt(a.points, 10);
                    return result;
                  },
                  {} as StudentActivities
                ),
              presences:
                item.presences &&
                item.presences.split(',').map(i => parseInt(i, 10)),
            } as MeetingDetailsDTO['data'],
            student: {
              id: item.id,
              student_index: item.student_index,
              user_name: item.user_name,
            } as Student,
          }));
          res.status(codes.OK).send({ details });
        }
      );
    });
  });
};
