import { Flavor } from 'nom-ts';

import { UserId } from './User';

export namespace StudentTeam {
  export type NonEmpty = [UserId, ...UserId[]];
  export const Empty = null;
  export type Empty = Flavor<typeof Empty, 'StudentTeam.Empty'>;
}
export type StudentTeam = StudentTeam.NonEmpty | StudentTeam.Empty;
