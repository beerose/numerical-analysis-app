import { UserResultsModel } from 'common';

const HEADER = 'name and surename, index, final grade';

export function gradesToCsvRow(userResults: UserResultsModel) {
  const { index, finalGrade } = userResults;

  return [userResults.userName, index, finalGrade].join(',');
}

export function gradesToCsv(studentsResults: UserResultsModel[]) {
  return HEADER + '\n' + studentsResults.map(gradesToCsvRow).join('\n');
}
