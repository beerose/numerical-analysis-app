import { UserDTO } from '../../../../dist/common';

const header = ['name', 'index', 'email'];

export function studentToCsvRow(student: UserDTO) {
  const { student_index: index, email, user_name: name } = student;

  // RFC also says that "Spaces are considered part of a field and should not be ignored.
  return [name, index, email].join(',');
}

export function studentsToCsv(students: UserDTO[]) {
  return [header, ...students.map(studentToCsvRow)].join('\n');
}
