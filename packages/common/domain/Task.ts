import { Flavor } from 'nom-ts';

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
    choosable_subtasks: ChoosableSubtask[];
  };
};

export enum TaskKind {
  Homework = 'homework', // zadanie domowe
  Assignment = 'assignment', // pracownia
  Exam = 'exam', // egzamin
  Test = 'test', // sprawdzian
  MidtermTest = 'midtermTest', // sprawdzian połówkowy
  ShortTest = 'shortTest', // kartkówka
  Retake = 'retake', // egzamin poprawkowy
  MidtermExam = 'midtermExam', // egzamin połówkowy
  Colloquium = 'colloquium', // kolokwium
}

export type ChoosableSubtask = {
  id: number;
  group_capacity: number;
  max_groups: number;
};
