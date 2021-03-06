import { Flavor } from 'nom-ts';

import { StudentTeam } from './selectableSubtasks';

export type TaskId = Flavor<number, 'TaskId'>;

export type TaskDTO = {
  id: TaskId;
  name: string;
  kind: TaskKind;
  weight: number;
  max_points: number;
  results_date?: string | Date; // if empty then due date
  description?: string;
  verify_upload: boolean; // default true
  start_upload_date: string | Date;
  end_upload_date: string | Date; // due date of the task
  start_vote_date: string | Date;
  end_vote_date: string | Date;
  data?: {
    choosable_subtasks: SelectableSubtask[];
  };
};

export enum TaskKind {
  Homework = 'homework', // zadanie domowe
  Assignment = 'assignment', // pracownia
  Exam = 'exam', // egzamin
  Test = 'test', // sprawdzian
  Retake = 'retake', // egzamin poprawkowy
}

export type SelectableSubtask = {
  id: number;
  // TODO: Migrate this name to `team_capacity`
  group_capacity: number;
  max_groups: number;
  takenBy: StudentTeam[];
};
