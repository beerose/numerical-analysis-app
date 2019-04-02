import { UserResultsModel } from 'common';

export function gradesToCsvRow(userResults: UserResultsModel) {
  const [name, surname] = userResults.userName.split(' ');
  const { index, finalGrade } = userResults;

  return [name, surname, index, finalGrade].join(',');
}

export function gradesToCsv(studentsResults: UserResultsModel[]) {
  return studentsResults.map(gradesToCsvRow).join('\n');
}
