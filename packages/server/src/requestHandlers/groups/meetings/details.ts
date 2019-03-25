import {
  apiMessages,
  MeetingDetailsDTO,
  Student,
  StudentActivities,
} from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, GetRequest, handleBadRequest } from '../../../lib';
import { db } from '../../../store';

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
    db.getPresencesInGroup({ groupId: Number(group_id) }, (err, data) => {
      if (err) {
        res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }
      const details = data.map(item => {
        let activities: StudentActivities = {};
        item.meetings_data.forEach(o => {
          activities[o.meeting_id] = o.points;
        });
        return {
          data: {
            activities,
            presences: item.meetings_data.map(o => o.meeting_id),
          } as MeetingDetailsDTO['data'],
          student: {
            id: item.id,
            student_index: item.student_index,
            user_name: item.user_name,
          } as Student,
        };
      });
      res.status(codes.OK).send({ details });
    });
  });
};
