import {
  ApiResponse,
  GroupDTO,
  MeetingDetailsModel,
  MeetingDTO,
  UserDTO,
  UserRole,
} from 'common';
import { Moment } from 'moment';
import React from 'react';
import { Omit, RouteChildrenProps } from 'react-router';

import * as groupsService from '../../api/groupApi';
import * as usersService from '../../api/userApi';
import { showMessage } from '../../utils';
import { ComponentCallbacks } from '../../utils/ComponentCallbacks';

const noGroupError = 'No group in state.';

type StateValues = {
  meetings?: MeetingDTO[];
  meetingsDetails?: MeetingDetailsModel[];
  groups?: GroupDTO[];
  currentGroup?: GroupDTO;
  isLoading: boolean;
  error: boolean;
  errorMessage?: string;
  superUsers: UserDTO[];
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
  error: false,
  isLoading: false,
  superUsers: [],
});

export class GroupApiProvider extends React.Component<
  RouteChildrenProps,
  StateValues
> {
  constructor(props: RouteChildrenProps) {
    super(props);

    const state: GroupApiContextState = {
      // actions won't be accessible from class body
      actions: {
        addMeeting: this.addMeeting,
        addNewStudentToGroup: this.addNewStudentToGroup,
        addPresence: this.addPresence,
        createGroup: this.createGroup,
        deleteGroup: this.deleteGroup,
        deleteMeeting: this.deleteMeeting,
        deletePresence: this.deletePresence,
        deleteStudentFromGroup: this.deleteStudentFromGroup,
        getGroup: this.getGroup,
        getMeetingsDetails: this.getMeetingsDetails,
        goToGroupsPage: this.goToGroupsPage,
        listGroups: this.listGroups,
        listLecturers: this.listLecturers,
        listMeetings: this.listMeetings,
        listStudentsWithGroup: this.listStudentsWithGroup,
        setActivity: this.setActivity,
        setStudentMeetingDetails: this.setStudentMeetingDetails,
        updateMeeting: this.updateMeeting,
        updateStudentInGroup: this.updateStudentInGroup,
        uploadUsers: this.uploadUsers,
      },
      error: false,
      isLoading: false,
      superUsers: [],
    };

    this.state = state as StateValues;
  }

  goToGroupsPage = () => {
    this.props.history.push('/groups');
  };

  createGroup = ({
    academic_year,
    group_name,
    group_type,
    lecturer_id,
  }: Pick<
    GroupDTO,
    'academic_year' | 'group_name' | 'group_type' | 'lecturer_id'
  >) => {
    this.setState({ isLoading: true });
    groupsService
      .addGroup({
        academic_year,
        group_name,
        group_type,
        lecturer_id,
      })
      .then(res => {
        this.setState({ isLoading: false });
        if (!('error' in res)) {
          this.props.history.push(`/groups/${res.group_id}`);
        }
      });
  };

  listLecturers = () =>
    usersService
      .listUsers({ roles: [UserRole.superUser, UserRole.admin] })
      .then(res => {
        this.setState({ superUsers: res.users });
        return res.users;
      });

  getGroup = () => {
    const groupId = Number(this.props.location.pathname.split('/')[2]);
    groupsService.getGroup(groupId).then(res => {
      if ('error' in res) {
        showMessage(res);
        this.props.history.push('/groups/');
      }
      this.setState({ currentGroup: res });
    });
  };

  listGroups = () => {
    this.setState({ isLoading: true });
    groupsService
      .listGroups()
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

  listStudentsWithGroup = async () => {
    this.setState({ isLoading: true });
    return groupsService.listStudentsWithGroup().then(res => {
      this.setState({
        isLoading: false,
      });
      return res.students;
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
    await usersService.updateUser({ ...user, user_role: UserRole.student });
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

  render() {
    return (
      <GroupApiContext.Provider value={this.state as GroupApiContextState}>
        {this.props.children}
      </GroupApiContext.Provider>
    );
  }
}
