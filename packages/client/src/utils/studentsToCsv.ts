import { UserDTO } from '../../../../dist/common';

export function studentToCsvRow(student: UserDTO) {
  const [name, surname] = student.user_name.split(' ');
  const { student_index: index, email } = student;

  // RFC also says that "Spaces are considered part of a field and should not be ignored.
  return [name, surname, index, email].join(',');
}

export function studentsToCsv(students: UserDTO[]) {
  return students.map(studentToCsvRow).join('\n');
}
