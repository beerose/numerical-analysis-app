/**
 * TODO:
 * Use zustand to get rid of these ugly casts and classes
 */
import {
  ApiResponse,
  GroupDTO,
  MeetingDetailsModel,
  MeetingDTO,
  TaskDTO,
  UserDTO,
  UserRole,
  UserWithGroups,
} from 'common';
import fromPairs from 'lodash.frompairs';
import { Moment } from 'moment';
import React from 'react';
import { Omit, RouteChildrenProps } from 'react-router';
import { FunctionKeys } from 'utility-types';

import { ApiResponse2 } from '../../api/authFetch';
import * as groupsService from '../../api/groupApi';
import * as usersService from '../../api/userApi';
import { showMessage } from '../../utils';
import { ComponentCallbacks } from '../../utils/ComponentCallbacks';

const noGroupError = 'No group in state.';
const noTaskError = 'No task in state.';

function getOwnFunctions<T extends object>(object: T) {
  return fromPairs(
    Object.entries(object).filter(([_, v]) => typeof v === 'function')
  ) as Pick<T, FunctionKeys<T>>;
}

type StateValues = {
  meetings?: MeetingDTO[];
  meetingsDetails?: MeetingDetailsModel[];
  groups?: GroupDTO[];
  currentGroup?: GroupDTO;
  currentTask?: TaskDTO;
  isLoading: boolean;
  error?: ApiResponse2.Error | Error;
  lecturers?: UserDTO[];
  currentGroupStudents?: UserWithGroups[];
};

export type GroupApiContextState = {
  actions: ComponentCallbacks<GroupApiProvider>;
} & StateValues;

export const GroupApiContext = React.createContext<GroupApiContextState>({
  actions: new Proxy({} as GroupApiProvider, {
    // tslint:disable-next-line:no-reserved-keywords
    get(_, name) {
      if (name in GroupApiProvider.prototype) {
        return name;
      }
      throw new Error(
        `${name.toString()} is not a property of GroupApiProvider instance`
      );
    },
  }),
  isLoading: false,
});

export class GroupApiProvider extends React.Component<
  Pick<RouteChildrenProps, 'history' | 'location'>,
  StateValues
> {
  constructor(props: RouteChildrenProps) {
    super(props);

    const state: GroupApiContextState = {
      actions: (getOwnFunctions(this) as unknown) as ComponentCallbacks<
        GroupApiProvider
      >,
      isLoading: false,
    };

    // this.state.actions won't be accessible from class body
    this.state = state as StateValues;
  }

  cleanCurrentGroup = () => {
    this.setState({ currentGroup: undefined });
  };

  createGroup = ({
    semester,
    group_name,
    group_type,
    lecturer_id,
  }: Pick<
    GroupDTO,
    'semester' | 'group_name' | 'group_type' | 'lecturer_id'
  >) => {
    this.setState({ isLoading: true });
    groupsService
      .addGroup({
        group_name,
        group_type,
        lecturer_id,
        semester,
      })
      .then(res => {
        this.setState({ isLoading: false });
        if (!('error' in res)) {
          this.props.history.push(`/groups/${res.group_id}`);
        }
      });
  };

  updateGroup = (group: Omit<groupsService.UpdateGroupPayload, 'id'>) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    return groupsService
      .updateGroup({ ...group, id: this.state.currentGroup.id })
      .then(res => {
        showMessage(res);
        return res;
      });
  };

  listLecturers = () =>
    usersService
      .listUsers({ roles: [UserRole.SuperUser, UserRole.Admin] })
      .then(res => {
        this.setState({ lecturers: res.users });
        return res.users;
      });

  getGroup = async (groupId?: GroupDTO['id']) => {
    if (!groupId) {
      // tslint:disable-next-line:no-parameter-reassignment // runtime default arg
      groupId = Number(this.props.location.pathname.split('/')[2]);
    }
    const res = await groupsService.getGroup(groupId);
    if ('error' in res) {
      showMessage(res);
      this.props.history.push('/groups/');
    }
    this.setState({ currentGroup: res });
    return res;
  };

  listGroups = (query?: Parameters<typeof groupsService.listGroups>[0]) => {
    this.setState({ isLoading: true });
    groupsService
      .listGroups(query)
      .then(res => {
        this.setState({ groups: res.groups, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  };

  deleteGroup = (id: GroupDTO['id']) => {
    this.setState({ isLoading: true });
    groupsService.deleteGroup(id).then(() => {
      this.listGroups();
    });
  };

  addPresence = (
    studentId: number,
    meetingId: number
  ): Promise<ApiResponse> => {
    return groupsService.addPresence(studentId, meetingId);
  };

  deletePresence = (
    studentId: number,
    meetingId: number
  ): Promise<ApiResponse> => {
    return groupsService.deletePresence(studentId, meetingId);
  };

  setActivity = (
    studentId: number,
    meetingId: number,
    points: number
  ): Promise<ApiResponse> => {
    return groupsService.setActivity(studentId, meetingId, points);
  };

  listMeetings = () => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    groupsService.listMeetings(this.state.currentGroup.id).then(meetings => {
      this.setState({ meetings });
    });
  };

  getMeetingsDetails = () => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    groupsService.getMeetingsDetails(this.state.currentGroup.id).then(res => {
      this.setState({ meetingsDetails: res });
    });
  };

  setStudentMeetingDetails = (
    studentId: UserDTO['id'],
    newStudentMeetingDetails: MeetingDetailsModel
  ) => {
    this.setState(({ meetingsDetails }) => {
      const newMeetingsDetails = [...meetingsDetails];
      newMeetingsDetails[studentId] = newStudentMeetingDetails;
      return { meetingsDetails: newMeetingsDetails };
    });
  };

  addMeeting = async (values: { name: string; date: Moment }) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    this.setState({ isLoading: true });
    await groupsService.addMeeting(values, this.state.currentGroup.id);
    this.setState({ isLoading: false });
  };

  deleteMeeting = async (id: MeetingDTO['id']) => {
    this.setState({ isLoading: true });
    await groupsService.deleteMeeting(id);
    this.setState({ isLoading: false });
  };

  updateMeeting = async (values: Pick<MeetingDTO, 'id' & 'name' & 'date'>) => {
    this.setState({ isLoading: true });
    await groupsService.updateMeeting(values);
    this.setState({ isLoading: false });
  };

  listStudentsInGroup = async () => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    this.setState({ isLoading: true });
    const {
      currentGroup: { id: groupId },
    } = this.state;
    /**
     * TODO: Stop sending all students with groups
     * Stop filtering here
     */
    return groupsService.listStudentsWithGroup(groupId).then(res => {
      if (ApiResponse2.isError(res)) {
        throw res;
      }

      const students = res.data.students;

      this.setState({
        currentGroupStudents: students.filter(
          s =>
            this.state.currentGroup &&
            s.group_ids.includes(this.state.currentGroup.id)
        ),
        isLoading: false,
      });

      return students;
    });
  };

  deleteStudentFromGroup = async (userId: UserDTO['id']) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    this.setState({ isLoading: true });
    await groupsService.deleteUserFromGroup(userId, this.state.currentGroup.id);
    this.setState({ isLoading: false });
  };

  updateStudentInGroup = async (user: Omit<UserDTO, 'user_role'>) => {
    await usersService.updateUser({ ...user, user_role: UserRole.Student });
  };

  addNewStudentToGroup = (user: UserDTO) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    return groupsService.addStudentToGroup(user, this.state.currentGroup.id);
  };

  uploadUsers = (payload: string) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    return groupsService.uploadUsers(payload, this.state.currentGroup.id);
  };

  listTasks = ({ all }: { all?: boolean }) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    return groupsService.listTasks(
      all ? undefined : this.state.currentGroup.id
    );
  };

  deleteTaskFromGroup = async (taskId: TaskDTO['id']) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    this.setState({ isLoading: true });
    const res = await groupsService.deleteTaskFromGroup(
      this.state.currentGroup.id,
      taskId
    );
    this.setState({ isLoading: false });
    return res;
  };

  createTask = async (task: Omit<TaskDTO, 'id'>) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    this.setState({ isLoading: true });
    const res = await groupsService.createTask(
      task,
      this.state.currentGroup.id
    );
    this.setState({ isLoading: false });
    return res;
  };

  getTask = async () => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    const taskId = Number(this.props.location.pathname.split('/')[4]);
    this.setState({ isLoading: true });
    const res = await groupsService.getTask(taskId, this.state.currentGroup.id);
    this.setState({ currentTask: res.task, isLoading: false });
    return res;
  };

  updateTask = async (task: TaskDTO) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    if (!this.state.currentTask) {
      throw new Error(noTaskError);
    }
    this.setState({ isLoading: true });
    const res = await groupsService.updateTask(
      { ...task, id: this.state.currentTask.id },

      this.state.currentGroup.id
    );
    this.setState({ isLoading: false });
    return res;
  };

  setTaskPoints = (
    taskId: TaskDTO['id'],
    userId: UserDTO['id'],
    points: number
  ) => {
    return groupsService.setTaskPoints(taskId, userId, points);
  };

  getGrades = async (taskId: TaskDTO['id']) => {
    const res = await groupsService.getGrades(taskId);
    return res.grades;
  };

  getResults = () => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    return groupsService.getResults(this.state.currentGroup.id);
  };

  setFinalGrade = (userId: UserDTO['id'], grade: number) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    return groupsService.setFinalGrade(
      this.state.currentGroup.id,
      userId,
      grade
    );
  };

  getAttached = () => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    return groupsService.getAttached(this.state.currentGroup.id);
  };

  attach = (attachedGroupId: GroupDTO['id']) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    return groupsService.attachGroup(
      attachedGroupId,
      this.state.currentGroup.id
    );
  };

  detach = (groupId: GroupDTO['id']) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    return groupsService.detachGroup(groupId);
  };

  attachTask = async (taskId: TaskDTO['id'], weight: number) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    return groupsService.attachTask(this.state.currentGroup.id, taskId, weight);
  };

  shareForEdit = async (userId: UserDTO['id']) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }

    return groupsService.shareForEdit(this.state.currentGroup.id, userId);
  };

  unshareForEdit = async (userId: UserDTO['id']) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }

    return groupsService.unshareForEdit(this.state.currentGroup.id, userId);
  };

  getGroupsForStudent = (
    ...args: Parameters<typeof groupsService.getStudentGroups>
  ) => {
    return groupsService.getStudentGroups(...args).then(res => {
      if ('data' in res) {
        const { groups } = res.data;
        this.setState({ groups });
        return groups;
      }

      this.setState({ error: res });
      return res;
    });
  };

  getStudentTasksSummary = (
    ...args: Parameters<typeof groupsService.getStudentTasksSummary>
  ) => {
    return groupsService
      .getStudentTasksSummary(...args)
      .then(res => {
        if ('data' in res) {
          const { tasksSummary } = res.data;
          console.assert(tasksSummary, 'response malformed');
          return tasksSummary;
        }

        this.setState({ error: res });
        return res;
      })
      .catch((err: Error) => {
        this.setState({ error: err });
        return err;
      });
  };

  render() {
    return (
      <GroupApiContext.Provider value={this.state as GroupApiContextState}>
        {this.props.children}
      </GroupApiContext.Provider>
    );
  }
}
