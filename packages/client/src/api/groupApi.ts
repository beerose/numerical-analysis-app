import {
  ApiResponse,
  GroupDTO,
  GroupId,
  MeetingDetailsModel,
  MeetingDTO,
  ServerRoutes,
  StudentTasksSummary,
  TaskDTO,
  UserDTO,
  UserId,
  UserResultsDTO,
  UserTaskPoints,
  UserWithGroups,
} from 'common';
import * as qs from 'query-string';
import { Omit } from 'react-router';
import { DeepRequired } from 'utility-types';

import { showMessage } from '../utils/showMessage';

import { SERVER_URL } from '.';
import { ApiResponse2, authFetch, authFetch2 } from './authFetch';

const { Groups, Grades } = ServerRoutes;

export const uploadUsers = async (fileContent: string, groupId: GroupId) => {
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
) => {
  return authFetch2<{ groups: GroupDTO[] }>(`${SERVER_URL}${Groups.List}`, {
    query,
  });
};

export const getGroup = async (groupId: GroupId) =>
  authFetch2<GroupDTO>(`${SERVER_URL}${Groups.Get}`, {
    query: { group_id: groupId },
  });

export const listStudentsWithGroup = async (groupId: GroupId) => {
  return authFetch2<{ students: UserWithGroups[] }>(
    SERVER_URL + Groups.Students.List,
    {
      query: { group_id: groupId },
    }
  );
};

export const deleteUserFromGroup = async (userId: UserId, groupId: GroupId) => {
  const options = {
    body: JSON.stringify({ user_id: userId, group_id: groupId }),
    method: 'DELETE',
  };

  return authFetch<ApiResponse>(
    SERVER_URL + Groups.Students.RemoveFromGroup,
    options
  ).then(showMessage);
};

export const addStudentToGroup = async (user: UserDTO, groupId: GroupId) => {
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
  Pick<DeepRequired<GroupDTO>, 'data'> & { prev_lecturer_id: UserId };

export const updateGroup = (group: UpdateGroupPayload) => {
  return authFetch<ApiResponse>(SERVER_URL + Groups.Update, {
    body: JSON.stringify(group),
    method: 'POST',
  });
};

export const addMeeting = (
  meeting: Pick<MeetingDTO, 'meeting_name' & 'date'>,
  groupId: GroupId
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

export const listMeetings = (groupId: GroupId) => {
  return authFetch2<MeetingDTO[]>(`${SERVER_URL + Groups.Meetings.List}`, {
    query: {
      group_id: groupId,
    },
  });
};

export const deleteGroup = async (groupId: GroupId) => {
  const options = {
    body: JSON.stringify({ group_id: groupId }),
    method: 'DELETE',
  };

  await authFetch<ApiResponse>(SERVER_URL + Groups.Delete, options).then(
    showMessage
  );
};

export const getMeetingsDetails = (
  groupId: GroupId
): Promise<MeetingDetailsModel[]> => {
  const options = {
    method: 'GET',
  };

  return authFetch2<{ details: MeetingDetailsModel[] }>(
    `${SERVER_URL + Groups.Meetings.Details}`,
    {
      query: {
        group_id: groupId,
      },
    }
  ).then(res => {
    if (ApiResponse2.isError(res)) {
      throw res;
    }
    return res.data.details.map(item => ({
      data: {
        activities: item.data.activities,
        presences: new Set(item.data.presences),
      },
      student: item.student,
    }));
  });
};

export const addPresence = (studentId: UserId, meetingId: MeetingDTO['id']) => {
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
  studentId: UserId,
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
  studentId: UserId,
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

export const listTasks = (groupId?: GroupId) =>
  authFetch2<{ tasks: TaskDTO[] }>(SERVER_URL + Groups.Tasks.List, {
    query: {
      group_id: groupId,
    },
  });

export const deleteTaskFromGroup = (
  groupId: GroupId,
  taskId: TaskDTO['id']
) => {
  const options = {
    body: JSON.stringify({ group_id: groupId, task_id: taskId }),
    method: 'DELETE',
  };

  return authFetch<ApiResponse>(SERVER_URL + Groups.Tasks.Delete, options);
};

export const createTask = (task: Omit<TaskDTO, 'id'>, groupId: GroupId) => {
  return authFetch2<{ task_id: number } & ApiResponse>(
    SERVER_URL + Groups.Tasks.Create,
    {
      body: { ...task, group_id: groupId },
      method: 'POST',
    }
  );
};

export const getTask = (taskId: TaskDTO['id'], groupId: GroupId) =>
  authFetch2<{ task: TaskDTO }>(SERVER_URL + Groups.Tasks.Get, {
    query: {
      group_id: groupId,
      task_id: taskId,
    },
  });

export const updateTask = (task: TaskDTO, groupId: GroupId) =>
  authFetch<ApiResponse>(SERVER_URL + Groups.Tasks.Update, {
    body: JSON.stringify({ ...task, group_id: groupId }),
    method: 'POST',
  });

export const setTaskPoints = (
  taskId: TaskDTO['id'],
  userId: UserId,
  points: number
) =>
  authFetch<ApiResponse>(SERVER_URL + Grades, {
    body: JSON.stringify({ points, task_id: taskId, user_id: userId }),
    method: 'POST',
  });

export const getGrades = (taskId: TaskDTO['id']) =>
  authFetch2<{ grades: UserTaskPoints[] }>(SERVER_URL + Grades, {
    query: {
      task_id: taskId,
    },
  });

export const getResults = (groupId: GroupId) =>
  authFetch2<UserResultsDTO[]>(SERVER_URL + Groups.Results.Get, {
    query: {
      group_id: groupId,
    },
  });

export const setFinalGrade = (
  groupId: GroupId,
  userId: UserId,
  grade: number
) =>
  authFetch<ApiResponse>(SERVER_URL + Groups.Results.SetFinal, {
    body: JSON.stringify({ grade, group_id: groupId, user_id: userId }),
    method: 'POST',
  });

export const getAttached = (groupId: GroupId) =>
  authFetch2<{ groups: GroupDTO[] }>(`${SERVER_URL + Groups.GetAttached}}`, {
    query: {
      group_id: groupId,
    },
  });

export const attachGroup = (groupId: GroupId, parentGroupId: GroupId) =>
  authFetch(SERVER_URL + Groups.Attach, {
    body: JSON.stringify({ group_id: groupId, parent_group_id: parentGroupId }),
    method: 'POST',
  });

export const detachGroup = (groupId: GroupId) =>
  authFetch(SERVER_URL + Groups.Detach, {
    body: JSON.stringify({ group_id: groupId }),
    method: 'POST',
  });

export const attachTask = (
  groupId: GroupId,
  taskId: TaskDTO['id'],
  weight: number
) =>
  authFetch(SERVER_URL + Groups.Tasks.Attach, {
    body: JSON.stringify({ weight, group_id: groupId, task_id: taskId }),
    method: 'POST',
  });

export const shareForEdit = (groupId: GroupId, userId: UserId) =>
  authFetch(SERVER_URL + Groups.ShareForEdit, {
    body: JSON.stringify({ group_id: groupId, user_id: userId }),
    method: 'POST',
  });

export const unshareForEdit = (groupId: GroupId, userId: UserId) =>
  authFetch(SERVER_URL + Groups.UnshareForEdit, {
    body: JSON.stringify({ group_id: groupId, user_id: userId }),
    method: 'POST',
  });

/*
 * Calls for student's part of the app
 */

export const getStudentGroups = (userId: UserId) =>
  authFetch2<{ groups: GroupDTO[] }>(
    SERVER_URL + ServerRoutes.Users.Student.Groups(userId)
  );

export const getStudentTasksSummary = (userId: UserId, groupId?: GroupId) =>
  authFetch2<{ tasksSummary: StudentTasksSummary }>(
    SERVER_URL + ServerRoutes.Users.Student.Tasks(userId),
    {
      query: { groupId },
    }
  );

// TODO: Add this to GroupApiContext and use it.
export const getStudentWithGroupGrade = (userId: UserId, groupId?: GroupId) =>
  authFetch2<{ studentWithGroup: UserWithGroups }>(
    SERVER_URL + ServerRoutes.Users.Student.GroupGrade(userId),
    {
      query: { groupId },
    }
  );
