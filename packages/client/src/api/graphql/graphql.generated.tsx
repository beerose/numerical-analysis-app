import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
};

export type AllUsersMeetingsInput = {
  groupId: Scalars['ID'];
};

export type JoinTeamResponse = {
  __typename?: 'JoinTeamResponse';
  error?: Maybe<JoinTeamResponseError>;
  data: Team;
};

export enum JoinTeamResponseError {
  TeamTooBig = 'TeamTooBig',
}

export type Mutation = {
  __typename?: 'Mutation';
  selectSubtask: SelectSubtaskResponse;
  joinTeam: JoinTeamResponse;
  leaveTeam?: Maybe<Team>;
};

export type MutationSelectSubtaskArgs = {
  taskId: Scalars['ID'];
  subtaskId: Scalars['ID'];
};

export type MutationJoinTeamArgs = {
  teamId: Scalars['ID'];
};

export type MutationLeaveTeamArgs = {
  teamId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  task?: Maybe<Task>;
  student?: Maybe<Student>;
};

export type QueryTaskArgs = {
  id: Scalars['ID'];
};

export type QueryStudentArgs = {
  id: Scalars['ID'];
};

export type SelectableSubtask = {
  __typename?: 'SelectableSubtask';
  id: Scalars['ID'];
  maxTeams: Scalars['Int'];
  teamCapacity: Scalars['Int'];
  takenBy: Team[];
};

export type SelectSubtaskResponse = {
  __typename?: 'SelectSubtaskResponse';
  error?: Maybe<SelectSubtaskResponseError>;
  createdTeam?: Maybe<Team>;
  subtask: SelectableSubtask;
};

export enum SelectSubtaskResponseError {
  TooManyTeamsTookThisSubtask = 'TooManyTeamsTookThisSubtask',
}

export type Student = {
  __typename?: 'Student';
  id: Scalars['ID'];
  allStudentMeetings?: Maybe<StudentMeeting[]>;
};

export type StudentAllStudentMeetingsArgs = {
  where?: Maybe<AllUsersMeetingsInput>;
};

export type StudentMeeting = {
  __typename?: 'StudentMeeting';
  meetingId: Scalars['ID'];
  meetingName: Scalars['String'];
  date: Scalars['DateTime'];
  groupId: Scalars['ID'];
  points?: Maybe<Scalars['Float']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  subtaskModified?: Maybe<SelectableSubtask>;
};

export type SubscriptionSubtaskModifiedArgs = {
  in: SubtaskSelectedInput;
};

export type SubtaskSelectedInput = {
  taskId: Scalars['ID'];
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['ID'];
  selectableSubtask?: Maybe<SelectableSubtask>;
  selectableSubtasks: SelectableSubtask[];
};

export type TaskSelectableSubtaskArgs = {
  id: Scalars['ID'];
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID'];
  students: Student[];
};
export type StudentMeetingsQueryVariables = {
  id: Scalars['ID'];
};

export type StudentMeetingsQuery = { __typename?: 'Query' } & {
  student: Maybe<
    { __typename?: 'Student' } & {
      allStudentMeetings: Maybe<
        Array<
          { __typename?: 'StudentMeeting' } & Pick<
            StudentMeeting,
            'meetingName' | 'meetingId' | 'date' | 'groupId' | 'points'
          >
        >
      >;
    }
  >;
};

export const StudentMeetingsDocument = gql`
  query StudentMeetings($id: ID!) {
    student(id: $id) {
      allStudentMeetings {
        meetingName
        meetingId
        date
        groupId
        points
      }
    }
  }
`;

export function useStudentMeetingsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    StudentMeetingsQuery,
    StudentMeetingsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    StudentMeetingsQuery,
    StudentMeetingsQueryVariables
  >(StudentMeetingsDocument, baseOptions);
}
export function useStudentMeetingsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    StudentMeetingsQuery,
    StudentMeetingsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    StudentMeetingsQuery,
    StudentMeetingsQueryVariables
  >(StudentMeetingsDocument, baseOptions);
}

export type StudentMeetingsQueryHookResult = ReturnType<
  typeof useStudentMeetingsQuery
>;
export type StudentMeetingsQueryResult = ApolloReactCommon.QueryResult<
  StudentMeetingsQuery,
  StudentMeetingsQueryVariables
>;
