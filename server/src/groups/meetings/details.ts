import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { GroupDTO, MeetingDetailsDTO, Student, StudentActivities } from '../../../../common/api';
import { apiMessages } from '../../../../common/apiMessages';
import { db } from '../../store';

interface GetMeetingsDetailsRequest extends Request {
  query: {
    group_id: GroupDTO['id'];
  };
}

export const getMeetingsDetails = (req: GetMeetingsDetailsRequest, res: Response) => {
  const { group_id } = req.query;
  db.getPresencesInGroup({ groupId: group_id }, (err, presences) => {
    if (err) {
      console.error(err);
      res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
    }
    db.getActivitiesInGroup({ groupId: group_id }, (activitiesErr, activities) => {
      if (activitiesErr) {
        console.error(activitiesErr);
        res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      const details = presences.map(item => ({
        data: {
          activities: activities
            .filter(a => a.id === item.id)
            .reduce(
              (result, a) => {
                result[parseInt(a.meeting_id, 10)] = parseInt(a.points, 10);
                return result;
              },
              {} as StudentActivities
            ),
          presences: item.presences && item.presences.split(',').map(i => parseInt(i, 10)),
        } as MeetingDetailsDTO['data'],
        student: {
          id: item.id,
          student_index: item.student_index,
          user_name: item.user_name,
        } as Student,
      }));
      res.status(codes.OK).send({ details });
    });
  });
};
