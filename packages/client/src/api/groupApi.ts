import {
  ApiResponse,
  GroupDTO,
  MeetingDetailsModel,
  MeetingDTO,
  ServerRoutes,
  TaskDTO,
  UserDTO,
  Grade,
} from 'common';
import * as qs from 'query-string';
import { Omit } from 'react-router';
import { DeepRequired } from 'utility-types';

import { showMessage } from '../utils/message';

import { SERVER_URL } from '.';
import { authFetch } from './authFetch';

const { Groups, Grades } = ServerRoutes;

export const uploadUsers = async (
  fileContent: string,
  groupId: GroupDTO['id']
) => {
  const options = {
    body: JSON.stringify({ data: fileContent, group_id: groupId }),
    method: 'POST',
  };

  await authFetch<{ message: string }>(
    SERVER_URL + Groups.Upload,
    options
  ).then(showMessage);
};

export const listGroups = async (): Promise<{ groups: GroupDTO[] }> => {
  const options = {
    method: 'GET',
  };

  return authFetch<{ groups: GroupDTO[] }>(SERVER_URL + Groups.List, options);
};

export const getGroup = async (groupId: GroupDTO['id']): Promise<GroupDTO> =>
  authFetch(
    `${SERVER_URL + Groups.Get}?${qs.stringify({ group_id: groupId })}`
  );

export const listStudentsWithGroup = async (): Promise<{
  students: (UserDTO & { group_ids: GroupDTO['id'][] })[];
}> => {
  const options = {
    method: 'GET',
  };

  return authFetch<{ students: (UserDTO & { group_ids: GroupDTO['id'][] })[] }>(
    SERVER_URL + Groups.Students.List,
    options
  );
};

export const deleteUserFromGroup = async (
  userId: UserDTO['id'],
  groupId: GroupDTO['id']
) => {
  const options = {
    body: JSON.stringify({ user_id: userId, group_id: groupId }),
    method: 'DELETE',
  };

  return authFetch<ApiResponse>(
    SERVER_URL + Groups.Students.RemoveFromGroup,
    options
  ).then(showMessage);
};

export const addStudentToGroup = async (
  user: UserDTO,
  groupId: GroupDTO['id']
) => {
  const options = {
    body: JSON.stringify({ user, group_id: groupId }),
    method: 'POST',
  };

  await authFetch<ApiResponse>(
    SERVER_URL + Groups.Students.AddToGroup,
    options
  ).then(showMessage);
};

export const addGroup = (
  group: Omit<GroupDTO, 'id'>
): Promise<{ group_id: string }> => {
  const options = {
    body: JSON.stringify(group),
    method: 'POST',
  };

  return authFetch<ApiResponse & { group_id: string }>(
    SERVER_URL + Groups.Create,
    options
  ).then(res => {
    showMessage(res);
    return res;
  });
};

export type UpdateGroupPayload = Omit<GroupDTO, 'data' | 'lecturer_name'> &
  Pick<DeepRequired<GroupDTO>, 'data'>;

export const updateGroup = (group: UpdateGroupPayload) => {
  return authFetch<ApiResponse>(SERVER_URL + Groups.Update, {
    body: JSON.stringify(group),
    method: 'POST',
  });
};

export const addMeeting = (
  meeting: Pick<MeetingDTO, 'meeting_name' & 'date'>,
  groupId: GroupDTO['id']
) => {
  const options = {
    body: JSON.stringify({ meeting, group_id: groupId }),
    method: 'POST',
  };

  return authFetch<ApiResponse>(
    SERVER_URL + Groups.Meetings.Create,
    options
  ).then(res => {
    showMessage(res);
    return res;
  });
};

export const updateMeeting = (
  meeting: Pick<MeetingDTO, 'meeting_name' & 'date' & 'id'>
) => {
  const options = {
    body: JSON.stringify({ meeting }),
    method: 'POST',
  };

  return authFetch<ApiResponse>(
    SERVER_URL + Groups.Meetings.Update,
    options
  ).then(res => {
    showMessage(res);
    return res;
  });
};

export const deleteMeeting = (id: number) => {
  const options = {
    body: JSON.stringify({ meeting_id: id }),
    method: 'DELETE',
  };

  return authFetch<ApiResponse>(
    SERVER_URL + Groups.Meetings.Delete,
    options
  ).then(res => {
    showMessage(res);
    return res;
  });
};

export const listMeetings = (
  groupId: GroupDTO['id']
): Promise<MeetingDTO[]> => {
  const options = {
    method: 'GET',
  };

  return authFetch<MeetingDTO[]>(
    `${SERVER_URL + Groups.Meetings.List}?${qs.stringify({
      group_id: groupId,
    })}`,
    options
  );
};

export const deleteGroup = async (groupId: GroupDTO['id']) => {
  const options = {
    body: JSON.stringify({ group_id: groupId }),
    method: 'DELETE',
  };

  await authFetch<ApiResponse>(SERVER_URL + Groups.Delete, options).then(
    showMessage
  );
};

export const getMeetingsDetails = (
  groupId: GroupDTO['id']
): Promise<MeetingDetailsModel[]> => {
  const options = {
    method: 'GET',
  };

  return authFetch<{ details: MeetingDetailsModel[] }>(
    `${SERVER_URL + Groups.Meetings.Details}?${qs.stringify({
      group_id: groupId,
    })}`,
    options
  ).then(res =>
    res.details.map(item => ({
      data: {
        activities: item.data.activities,
        presences: new Set(item.data.presences),
      },
      student: item.student,
    }))
  );
};

export const addPresence = (
  studentId: UserDTO['id'],
  meetingId: MeetingDTO['id']
) => {
  const options = {
    body: JSON.stringify({ student_id: studentId, meeting_id: meetingId }),
    method: 'POST',
  };

  return authFetch<ApiResponse>(
    SERVER_URL + Groups.Meetings.AddPresence,
    options
  ).then(result => {
    showMessage(result, { showError: true, showSuccess: false });
    return result;
  });
};

export const deletePresence = (
  studentId: UserDTO['id'],
  meetingId: MeetingDTO['id']
) => {
  const options = {
    body: JSON.stringify({ student_id: studentId, meeting_id: meetingId }),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'DELETE',
  };

  return authFetch<ApiResponse>(
    SERVER_URL + Groups.Meetings.DeletePresence,
    options
  ).then(result => {
    showMessage(result, { showError: true, showSuccess: false });
    return result;
  });
};

export const setActivity = (
  studentId: UserDTO['id'],
  meetingId: MeetingDTO['id'],
  points: number
) => {
  const options = {
    body: JSON.stringify({
      points,
      meeting_id: meetingId,
      student_id: studentId,
    }),
    method: 'POST',
  };

  return authFetch<ApiResponse>(
    SERVER_URL + Groups.Meetings.SetActivity,
    options
  ).then(result => {
    showMessage(result, { showError: true, showSuccess: false });
    return result;
  });
};

export const listTasks = (groupId: GroupDTO['id']) =>
  authFetch<{ tasks: TaskDTO[] }>(
    `${SERVER_URL + Groups.Tasks.List}?${qs.stringify({
      group_id: groupId,
    })}`
  );

export const deleteTaskFromGroup = (
  groupId: GroupDTO['id'],
  taskId: TaskDTO['id']
) => {
  const options = {
    body: JSON.stringify({ group_id: groupId, task_id: taskId }),
    method: 'DELETE',
  };

  return authFetch<ApiResponse>(SERVER_URL + Groups.Tasks.Delete, options);
};

export const createTask = (
  task: Omit<TaskDTO, 'id'>,
  groupId: GroupDTO['id']
) => {
  return authFetch<{ task_id: number } & ApiResponse>(
    SERVER_URL + Groups.Tasks.Create,
    {
      body: JSON.stringify({ ...task, group_id: groupId }),
      method: 'POST',
    }
  );
};

export const getTask = (taskId: TaskDTO['id'], groupId: GroupDTO['id']) =>
  authFetch<{ task: TaskDTO }>(
    `${SERVER_URL + Groups.Tasks.Get}?${qs.stringify({
      group_id: groupId,
      task_id: taskId,
    })}`
  );

export const updateTask = (task: TaskDTO, groupId: GroupDTO['id']) =>
  authFetch<ApiResponse>(SERVER_URL + Groups.Tasks.Update, {
    body: JSON.stringify({ ...task, group_id: groupId }),
    method: 'POST',
  });

export const setGrade = (
  taskId: TaskDTO['id'],
  userId: UserDTO['id'],
  points: number
) =>
  authFetch<ApiResponse>(SERVER_URL + Grades, {
    body: JSON.stringify({ task_id: taskId, user_id: userId, points }),
    method: 'POST',
  });

export const getGrades = (taskId: TaskDTO['id']) =>
  authFetch<{ grades: Grade[] }>(
    `${SERVER_URL + Grades}?${qs.stringify({
      task_id: taskId,
    })}`
  );
