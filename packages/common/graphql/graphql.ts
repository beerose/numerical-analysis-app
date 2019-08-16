import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
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

export type Mutation = {
  __typename?: 'Mutation';
  selectSelectableTask?: Maybe<SelectableSubtask>;
};

export type MutationSelectSelectableTaskArgs = {
  taskId: Scalars['Int'];
  selectableSubtaskId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  selectableSubtask?: Maybe<SelectableSubtask>;
  task?: Maybe<Task>;
};

export type QuerySelectableSubtaskArgs = {
  taskId: Scalars['Int'];
  selectableSubtaskId: Scalars['Int'];
};

export type QueryTaskArgs = {
  id: Scalars['Int'];
};

export type SelectableSubtask = {
  __typename?: 'SelectableSubtask';
  id: Scalars['Int'];
  maxGroups: Scalars['Int'];
  groupCapacity: Scalars['Int'];
  takenBy: Array<Team>;
};

export type Student = {
  __typename?: 'Student';
  id: Scalars['Int'];
};

export type Subscription = {
  __typename?: 'Subscription';
  subtaskSelected?: Maybe<SelectableSubtask>;
};

export type SubscriptionSubtaskSelectedArgs = {
  in: SubtaskSelectedInput;
};

export type SubtaskSelectedInput = {
  taskId: Scalars['Int'];
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['Int'];
  selectableSubtasks: Array<SelectableSubtask>;
};

export type Team = {
  __typename?: 'Team';
  students: Array<Student>;
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

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  SelectableSubtask: ResolverTypeWrapper<SelectableSubtask>;
  Team: ResolverTypeWrapper<Team>;
  Student: ResolverTypeWrapper<Student>;
  Task: ResolverTypeWrapper<Task>;
  Mutation: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  SubtaskSelectedInput: SubtaskSelectedInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  Int: Scalars['Int'];
  SelectableSubtask: SelectableSubtask;
  Team: Team;
  Student: Student;
  Task: Task;
  Mutation: {};
  Subscription: {};
  SubtaskSelectedInput: SubtaskSelectedInput;
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  selectSelectableTask?: Resolver<
    Maybe<ResolversTypes['SelectableSubtask']>,
    ParentType,
    ContextType,
    MutationSelectSelectableTaskArgs
  >;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  selectableSubtask?: Resolver<
    Maybe<ResolversTypes['SelectableSubtask']>,
    ParentType,
    ContextType,
    QuerySelectableSubtaskArgs
  >;
  task?: Resolver<
    Maybe<ResolversTypes['Task']>,
    ParentType,
    ContextType,
    QueryTaskArgs
  >;
};

export type SelectableSubtaskResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SelectableSubtask'] = ResolversParentTypes['SelectableSubtask']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  maxGroups?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  groupCapacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  takenBy?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
};

export type StudentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Student'] = ResolversParentTypes['Student']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = {
  subtaskSelected?: SubscriptionResolver<
    Maybe<ResolversTypes['SelectableSubtask']>,
    ParentType,
    ContextType,
    SubscriptionSubtaskSelectedArgs
  >;
};

export type TaskResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  selectableSubtasks?: Resolver<
    Array<ResolversTypes['SelectableSubtask']>,
    ParentType,
    ContextType
  >;
};

export type TeamResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']
> = {
  students?: Resolver<
    Array<ResolversTypes['Student']>,
    ParentType,
    ContextType
  >;
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SelectableSubtask?: SelectableSubtaskResolvers<ContextType>;
  Student?: StudentResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
