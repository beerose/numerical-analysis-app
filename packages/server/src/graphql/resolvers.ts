import {
  gqlApi,
  GroupId,
  SelectableSubtask,
  StudentTeam,
  TaskDTO,
  TaskId,
  UserDTO,
  UserId,
} from 'common';
import { pipe } from 'fp-ts/lib/pipeable';
import * as Arr from 'fp-ts/lib/Array';
import * as Either from 'fp-ts/lib/Either';
import * as Option from 'fp-ts/lib/Option';
import { GraphQLDateTime } from 'graphql-iso-date';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { Dict } from 'nom-ts';

import { fail } from '../lib/fail';

import { Context } from './Context';
import { TeamId } from './TeamId';

namespace pubsub {
  const _pubsub = new PubSub();

  export interface SubtaskModifiedEventPayload {
    subtask: gqlApi.SelectableSubtask;
    taskId: string;
    studentId: UserId;
    groupId: GroupId;
  }

  // tslint:disable-next-line: no-duplicate-string
  type Action = ['subtask-modified', SubtaskModifiedEventPayload];

  export function publish(...[triggerName, payload]: Action) {
    return _pubsub.publish(triggerName, payload);
  }

  export const asyncIterator: (
    triggers: Action[0] | Array<Action[0]>
  ) => AsyncIterator<unknown> = _pubsub.asyncIterator.bind(_pubsub);
}

const fakeDb = {
  tasks: {
    12: {
      id: 12,
      data: {
        choosable_subtasks: [
          {
            id: 1,
            max_groups: 3,
            group_capacity: 3,
            takenBy: [StudentTeam.Empty, [10], StudentTeam.Empty, [22, 57, 13]],
          },
        ],
      },
    },
  } as Dict<PropertyKey, Partial<TaskDTO> | undefined>,
  getTaskOrThrow(taskId: TaskId) {
    const task = this.tasks[taskId];
    if (!task) {
      throw new Error('task not found');
    }
    return task;
  },
  selectSubtaskAndCreateTeam(
    taskId: string,
    subtaskId: string,
    studentId: UserId
  ) {
    const task = fakeDb.getTaskOrThrow(Number(taskId));
    if (!task.data) {
      throw fail("task.data doesn't exist", 400);
    }

    const subtask = task.data.choosable_subtasks.find(
      s => String(s.id) === subtaskId
    );
    if (!subtask) {
      throw fail('subtask not found', 404);
    }

    if (subtask.max_groups <= subtask.takenBy.filter(Boolean).length) {
      return {
        error: gqlApi.SelectSubtaskResponseError.TooManyTeamsTookThisSubtask,
        subtask: transformSubtaskFromDb(subtask),
      };
    }

    const newLength = subtask.takenBy.push([studentId]);

    return {
      createdTeam: {
        id: TeamId(taskId, subtaskId, newLength - 1),
        students: [{ id: String(studentId) }],
      },
      subtask: transformSubtaskFromDb(subtask),
    };
  },
  joinTeam(teamId: TeamId, studentId: UserId) {
    const [taskId, subtaskId, teamNumber] = TeamId.unpack(teamId);

    const task = this.getTaskOrThrow(taskId);

    if (!task.data) {
      throw new Error('task.data does not exist');
    }

    pipe(
      task.data.choosable_subtasks,
      Arr.findFirst(subtask => subtask.id === subtaskId),
      Either.fromOption(() => `no subtask of ${subtaskId} found`),
      Either.chain(subtask => {
        const team = subtask.takenBy[teamNumber];
        if (team) {
          return Either.right(Arr.snoc(team, studentId));
        }
        return Either.left(`team ${teamId} doesn't exist`);
      }),
      Either.orElse(fail)
    );
  },
};

function transformSubtaskFromDb(
  dbSubtask: SelectableSubtask
): gqlApi.SelectableSubtask {
  return {
    id: String(dbSubtask.id),
    maxTeams: dbSubtask.max_groups,
    teamCapacity: dbSubtask.group_capacity,
    takenBy: [],
  };
}

export const resolvers: gqlApi.Resolvers<Context> = {
  DateTime: GraphQLDateTime,
  SelectableSubtask: {
    takenBy: (selectableSubtask, _args) => {
      return selectableSubtask.takenBy || [];
    },
  },
  Task: {
    selectableSubtask({ selectableSubtasks }, { id }) {
      return selectableSubtasks.find(s => s.id === id) || null;
    },
  },
  Query: {
    async task(_parent, { id }, _ctx) {
      const dbTask = fakeDb.tasks[id];

      console.log({ _ctx });

      return dbTask
        ? {
            id: String(dbTask.id),
            selectableSubtasks: pipe(
              Option.fromNullable(dbTask.data),
              Option.map(data => data && data.choosable_subtasks),
              Option.fold(
                () => [],
                xs => {
                  return Arr.map(transformSubtaskFromDb)(xs);
                }
              )
            ),
          }
        : null;
    },
  },
  Mutation: {
    selectSubtask(_parent, { taskId, subtaskId }, ctx) {
      const studentId = ctx.user.id;

      const res = fakeDb.selectSubtaskAndCreateTeam(
        taskId,
        subtaskId,
        studentId
      );

      pubsub.publish('subtask-modified', {
        studentId,
        taskId,
        subtask: res.subtask,
        groupId: ctx.groupId,
      });

      return res;
    },
  },
  Subscription: {
    subtaskModified: {
      // resolve: payload => {
      //   // TODO:  fix lib typings?
      //   const { message } = (payload as any) as MessageAddedPayload;
      //   return message;
      // },
      subscribe: withFilter(
        () => pubsub.asyncIterator('subtask-modified'),
        (
          event: pubsub.SubtaskModifiedEventPayload,
          input: gqlApi.SubtaskSelectedInput,
          ctx: Context
        ) => {
          if (event.taskId === input.taskId && event.groupId === ctx.groupId) {
            // TODO:
            // Should return true if user is in a group
            // that has this task and a taskId is in variables
            console.log(
              event.subtask,
              event.studentId,
              event.taskId,
              ctx.groupId,
              ctx.user
            );
            return true;
          }

          return false;
        }
      ),
    },
  },
};
