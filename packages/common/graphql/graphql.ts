import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  DateTime: Date,
};

export type AllUsersMeetingsInput = {
  groupId: Scalars['ID'],
};


export type JoinTeamResponse = {
  __typename?: 'JoinTeamResponse',
  error?: Maybe<JoinTeamResponseError>,
  data: Team,
};

export enum JoinTeamResponseError {
  TeamTooBig = 'TeamTooBig'
}

export type Mutation = {
  __typename?: 'Mutation',
  selectSubtask: SelectSubtaskResponse,
  joinTeam: JoinTeamResponse,
  leaveTeam?: Maybe<Team>,
};


export type MutationSelectSubtaskArgs = {
  taskId: Scalars['ID'],
  subtaskId: Scalars['ID']
};


export type MutationJoinTeamArgs = {
  teamId: Scalars['ID']
};


export type MutationLeaveTeamArgs = {
  teamId: Scalars['ID']
};

export type Query = {
  __typename?: 'Query',
  task?: Maybe<Task>,
  student?: Maybe<Student>,
};


export type QueryTaskArgs = {
  id: Scalars['ID']
};


export type QueryStudentArgs = {
  id: Scalars['ID']
};

export type SelectableSubtask = {
  __typename?: 'SelectableSubtask',
  id: Scalars['ID'],
  maxTeams: Scalars['Int'],
  teamCapacity: Scalars['Int'],
  takenBy: Array<Team>,
};

export type SelectSubtaskResponse = {
  __typename?: 'SelectSubtaskResponse',
  error?: Maybe<SelectSubtaskResponseError>,
  createdTeam?: Maybe<Team>,
  subtask: SelectableSubtask,
};

export enum SelectSubtaskResponseError {
  TooManyTeamsTookThisSubtask = 'TooManyTeamsTookThisSubtask'
}

export type Student = {
  __typename?: 'Student',
  id: Scalars['ID'],
  allStudentMeetings?: Maybe<Array<StudentMeeting>>,
};


export type StudentAllStudentMeetingsArgs = {
  where?: Maybe<AllUsersMeetingsInput>
};

export type StudentMeeting = {
  __typename?: 'StudentMeeting',
  meetingId: Scalars['ID'],
  meetingName: Scalars['String'],
  date: Scalars['DateTime'],
  groupId: Scalars['ID'],
  points?: Maybe<Scalars['Float']>,
};

export type Subscription = {
  __typename?: 'Subscription',
  subtaskModified?: Maybe<SelectableSubtask>,
};


export type SubscriptionSubtaskModifiedArgs = {
  in: SubtaskSelectedInput
};

export type SubtaskSelectedInput = {
  taskId: Scalars['ID'],
};

export type Task = {
  __typename?: 'Task',
  id: Scalars['ID'],
  selectableSubtask?: Maybe<SelectableSubtask>,
  selectableSubtasks: Array<SelectableSubtask>,
};


export type TaskSelectableSubtaskArgs = {
  id: Scalars['ID']
};

export type Team = {
  __typename?: 'Team',
  id: Scalars['ID'],
  students: Array<Student>,
};


export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Task: ResolverTypeWrapper<Task>,
  SelectableSubtask: ResolverTypeWrapper<SelectableSubtask>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Team: ResolverTypeWrapper<Team>,
  Student: ResolverTypeWrapper<Student>,
  AllUsersMeetingsInput: AllUsersMeetingsInput,
  StudentMeeting: ResolverTypeWrapper<StudentMeeting>,
  String: ResolverTypeWrapper<Scalars['String']>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  Mutation: ResolverTypeWrapper<{}>,
  SelectSubtaskResponse: ResolverTypeWrapper<SelectSubtaskResponse>,
  SelectSubtaskResponseError: SelectSubtaskResponseError,
  JoinTeamResponse: ResolverTypeWrapper<JoinTeamResponse>,
  JoinTeamResponseError: JoinTeamResponseError,
  Subscription: ResolverTypeWrapper<{}>,
  SubtaskSelectedInput: SubtaskSelectedInput,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  ID: Scalars['ID'],
  Task: Task,
  SelectableSubtask: SelectableSubtask,
  Int: Scalars['Int'],
  Team: Team,
  Student: Student,
  AllUsersMeetingsInput: AllUsersMeetingsInput,
  StudentMeeting: StudentMeeting,
  String: Scalars['String'],
  DateTime: Scalars['DateTime'],
  Float: Scalars['Float'],
  Mutation: {},
  SelectSubtaskResponse: SelectSubtaskResponse,
  SelectSubtaskResponseError: SelectSubtaskResponseError,
  JoinTeamResponse: JoinTeamResponse,
  JoinTeamResponseError: JoinTeamResponseError,
  Subscription: {},
  SubtaskSelectedInput: SubtaskSelectedInput,
  Boolean: Scalars['Boolean'],
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type JoinTeamResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['JoinTeamResponse'] = ResolversParentTypes['JoinTeamResponse']> = {
  error?: Resolver<Maybe<ResolversTypes['JoinTeamResponseError']>, ParentType, ContextType>,
  data?: Resolver<ResolversTypes['Team'], ParentType, ContextType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  selectSubtask?: Resolver<ResolversTypes['SelectSubtaskResponse'], ParentType, ContextType, MutationSelectSubtaskArgs>,
  joinTeam?: Resolver<ResolversTypes['JoinTeamResponse'], ParentType, ContextType, MutationJoinTeamArgs>,
  leaveTeam?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType, MutationLeaveTeamArgs>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  task?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, QueryTaskArgs>,
  student?: Resolver<Maybe<ResolversTypes['Student']>, ParentType, ContextType, QueryStudentArgs>,
};

export type SelectableSubtaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['SelectableSubtask'] = ResolversParentTypes['SelectableSubtask']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  maxTeams?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  teamCapacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  takenBy?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>,
};

export type SelectSubtaskResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SelectSubtaskResponse'] = ResolversParentTypes['SelectSubtaskResponse']> = {
  error?: Resolver<Maybe<ResolversTypes['SelectSubtaskResponseError']>, ParentType, ContextType>,
  createdTeam?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>,
  subtask?: Resolver<ResolversTypes['SelectableSubtask'], ParentType, ContextType>,
};

export type StudentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Student'] = ResolversParentTypes['Student']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  allStudentMeetings?: Resolver<Maybe<Array<ResolversTypes['StudentMeeting']>>, ParentType, ContextType, StudentAllStudentMeetingsArgs>,
};

export type StudentMeetingResolvers<ContextType = any, ParentType extends ResolversParentTypes['StudentMeeting'] = ResolversParentTypes['StudentMeeting']> = {
  meetingId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  meetingName?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  groupId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  points?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>,
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  subtaskModified?: SubscriptionResolver<Maybe<ResolversTypes['SelectableSubtask']>, ParentType, ContextType, SubscriptionSubtaskModifiedArgs>,
};

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  selectableSubtask?: Resolver<Maybe<ResolversTypes['SelectableSubtask']>, ParentType, ContextType, TaskSelectableSubtaskArgs>,
  selectableSubtasks?: Resolver<Array<ResolversTypes['SelectableSubtask']>, ParentType, ContextType>,
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  students?: Resolver<Array<ResolversTypes['Student']>, ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType,
  JoinTeamResponse?: JoinTeamResponseResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  SelectableSubtask?: SelectableSubtaskResolvers<ContextType>,
  SelectSubtaskResponse?: SelectSubtaskResponseResolvers<ContextType>,
  Student?: StudentResolvers<ContextType>,
  StudentMeeting?: StudentMeetingResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
  Task?: TaskResolvers<ContextType>,
  Team?: TeamResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
