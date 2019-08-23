import { Flavor } from 'nom-ts';

export type TeamId = Flavor<string, 'TeamId'>;

export function TeamId(
  taskId: string | number,
  subtaskId: string | number,
  teamIndex: number
): TeamId {
  return `${taskId}.${subtaskId}.${teamIndex}` as TeamId;
}

export namespace TeamId {
  export function unpack(teamId: TeamId) {
    const segments = teamId.split('.');
    console.assert(segments[0] && segments[1]);
    return segments.map(Number);
  }
  export function subtaskId(teamId: TeamId) {
    return TeamId.unpack(teamId)[0];
  }
  export function teamIndex(teamId: TeamId) {
    return TeamId.unpack(teamId)[1];
  }
}
