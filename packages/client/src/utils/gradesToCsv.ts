import { UserResultsModel } from 'common';

const HEADER = 'name, surename, index, final grade';

export function gradesToCsvRow(userResults: UserResultsModel) {
  const [name, surname] = userResults.userName.split(' ');
  const { index, finalGrade } = userResults;

  return [name, surname, index, finalGrade].join(',');
}

export function gradesToCsv(studentsResults: UserResultsModel[]) {
  return HEADER + '\n' + studentsResults.map(gradesToCsvRow).join('\n');
}
