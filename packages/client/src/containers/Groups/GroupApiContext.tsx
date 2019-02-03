import * as React from 'react';

import { ApiResponse, GroupDTO, UserDTO } from '../../../../../dist/common';

export type GroupContextState = {
  apiActions: {
    listSuperUsers: () => void;
    createGroup: ({
      academic_year,
      group_name,
      group_type,
      lecturer_id,
    }: Pick<
      GroupDTO,
      'academic_year' | 'group_name' | 'group_type' | 'lecturer_id'
    >) => void;
    getGroup: () => void;
    listGroups: () => void;
    deleteGroup: (groupId: GroupDTO['id']) => void;
    setActivity: (
      studentId: number,
      meetingId: number,
      points: number
    ) => Promise<ApiResponse>;
    addPresence: (studentId: number, meetingId: number) => Promise<ApiResponse>;
    deletePresence: (
      studentId: number,
      meetingId: number
    ) => Promise<ApiResponse>;
  };
  actions: {
    goToGroupsPage: () => void;
  };
  groups?: GroupDTO[];
  currentGroup?: GroupDTO;
  isLoading: boolean;
  error: boolean;
  errorMessage?: string;
  superUsers: UserDTO[];
};

export const GroupApiContext = React.createContext<GroupContextState>({
  actions: {
    goToGroupsPage: console.log.bind(console, 'goToGroupsPage'),
  },
  apiActions: {
    addPresence: (_: any) => ({} as Promise<ApiResponse>),
    createGroup: console.log.bind(console, 'createGroup'),
    deleteGroup: console.log.bind(console, 'deleteGroup'),
    deletePresence: (_: any) => ({} as Promise<ApiResponse>),
    getGroup: console.log.bind(console, 'getGroup'),
    listGroups: console.log.bind(console, 'listGroups'),
    listSuperUsers: console.log.bind(console, 'listSuperUsers'),
    setActivity: (_: any) => ({} as Promise<ApiResponse>),
  },
  error: false,
  isLoading: false,
  superUsers: [],
});
