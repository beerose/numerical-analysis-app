import {
  ApiResponse,
  GroupDTO,
  MeetingDetailsModel,
  MeetingDTO,
  ServerRoutes,
  TaskDTO,
  UserDTO,
  UserResultsDTO,
  UserTaskPoints,
  UserWithGroups,
} from 'common';
import * as qs from 'query-string';
import { Omit } from 'react-router';
import { DeepRequired } from 'utility-types';

import { showMessage } from '../utils/showMessage';

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

export const listGroups = async (
  query?: Partial<Pick<GroupDTO, 'lecturer_id'>>
): Promise<{ groups: GroupDTO[] }> => {
  const options = {
    method: 'GET',
  };

  return authFetch<{ groups: GroupDTO[] }>(
    `${SERVER_URL}${Groups.List}?${query ? qs.stringify(query) : ''}`,
    options
  );
};

export const getGroup = async (groupId: GroupDTO['id']): Promise<GroupDTO> =>
  authFetch(
    `${SERVER_URL}${Groups.Get}?${qs.stringify({ group_id: groupId })}`
  );

export const listStudentsWithGroup = async (): Promise<{
  students: UserWithGroups[];
}> => {
  const options = {
    method: 'GET',
  };

  return authFetch<{ students: UserWithGroups[] }>(
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
  Pick<DeepRequired<GroupDTO>, 'data'> & { prev_lecturer_id: UserDTO['id'] };

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

export const listTasks = (groupId?: GroupDTO['id']) =>
  authFetch<{ tasks: TaskDTO[] }>(
    `${SERVER_URL + Groups.Tasks.List}?${groupId &&
      qs.stringify({
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

export const setTaskPoints = (
  taskId: TaskDTO['id'],
  userId: UserDTO['id'],
  points: number
) =>
  authFetch<ApiResponse>(SERVER_URL + Grades, {
    body: JSON.stringify({ points, task_id: taskId, user_id: userId }),
    method: 'POST',
  });

export const getGrades = (taskId: TaskDTO['id']) =>
  authFetch<{ grades: UserTaskPoints[] }>(
    `${SERVER_URL + Grades}?${qs.stringify({
      task_id: taskId,
    })}`
  );

export const getResults = (groupId: GroupDTO['id']) =>
  authFetch<UserResultsDTO[]>(
    `${SERVER_URL + Groups.Results.Get}?${qs.stringify({
      group_id: groupId,
    })}`
  );

export const setFinalGrade = (
  groupId: GroupDTO['id'],
  userId: UserDTO['id'],
  grade: number
) =>
  authFetch<ApiResponse>(SERVER_URL + Groups.Results.SetFinal, {
    body: JSON.stringify({ grade, group_id: groupId, user_id: userId }),
    method: 'POST',
  });

export const getAttached = (groupId: GroupDTO['id']) =>
  authFetch<{ groups: GroupDTO[] }>(
    `${SERVER_URL + Groups.GetAttached}?${qs.stringify({
      group_id: groupId,
    })}`
  );

export const attachGroup = (
  groupId: GroupDTO['id'],
  parentGroupId: GroupDTO['id']
) =>
  authFetch(SERVER_URL + Groups.Attach, {
    body: JSON.stringify({ group_id: groupId, parent_group_id: parentGroupId }),
    method: 'POST',
  });

export const detachGroup = (groupId: GroupDTO['id']) =>
  authFetch(SERVER_URL + Groups.Detach, {
    body: JSON.stringify({ group_id: groupId }),
    method: 'POST',
  });

export const attachTask = (
  groupId: GroupDTO['id'],
  taskId: TaskDTO['id'],
  weight: number
) =>
  authFetch(SERVER_URL + Groups.Tasks.Attach, {
    body: JSON.stringify({ weight, group_id: groupId, task_id: taskId }),
    method: 'POST',
  });

export const shareForEdit = (groupId: GroupDTO['id'], userId: UserDTO['id']) =>
  authFetch(SERVER_URL + Groups.ShareForEdit, {
    body: JSON.stringify({ group_id: groupId, user_id: userId }),
    method: 'POST',
  });

export const getStudentGroups = (userId: UserDTO['id']) =>
  authFetch<{ groups: GroupDTO[] }>(
    SERVER_URL + ServerRoutes.Users.Student.Groups(userId)
  );
