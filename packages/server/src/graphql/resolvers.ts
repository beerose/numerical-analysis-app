import { gqlApi, SelectableSubtask, TaskDTO, TaskId } from 'common';
import { GraphQLDateTime } from 'graphql-iso-date';
import { Dict } from 'nom-ts';

type Context = {
  someData: string;
};

const fakeDb: { tasks: Dict<TaskId, Partial<TaskDTO>> } = {
  tasks: {
    12: {
      data: {
        choosable_subtasks: [
          {
            id: 1,
            max_groups: 2,
            group_capacity: 3,
          },
        ],
      },
    },
  },
};

function transformSubtaskFromDb(
  dbSubtask: SelectableSubtask
): gqlApi.SelectableSubtask {
  return {
    id: dbSubtask.id,
    maxGroups: dbSubtask.max_groups,
    groupCapacity: dbSubtask.group_capacity,
    takenBy: [],
  };
}

export const resolvers: gqlApi.Resolvers<Context> = {
  DateTime: GraphQLDateTime,
  Query: {
    async selectableSubtask(_parent, { taskId, selectableSubtaskId }, _ctx) {
      const dbTaskData = fakeDb.tasks[taskId].data;
      if (!dbTaskData) {
        return null;
      }

      const dbSubtask = dbTaskData.choosable_subtasks.find(
        x => x.id === selectableSubtaskId
      );
      if (!dbSubtask) {
        return null;
      }

      return {
        id: dbSubtask.id,
        maxGroups: dbSubtask.max_groups,
        groupCapacity: dbSubtask.group_capacity,
        takenBy: [],
      };
    },
    async task(_parent, { id }, _ctx) {
      const dbTask = fakeDb.tasks[id];

      return dbTask
        ? {
            id: Number(dbTask.id),
            selectableSubtasks: dbTask.data
              ? dbTask.data.choosable_subtasks.map(transformSubtaskFromDb)
              : [],
          }
        : null;
    },
  },
};
