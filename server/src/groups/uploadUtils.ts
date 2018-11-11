import { UserDTO } from '../../../common/api';
import { ROLES } from '../../../common/roles';

const DELIMITER = ',';

const isCSVRowValid = (line: string) => {
  const values = line.split(DELIMITER);
  return values.length === 4 && values.every(value => value !== '');
};

// csv format: name, surename, index, email
export const readCSV = (csvString: string): { users?: UserDTO[]; isValid: boolean } => {
  const lines = csvString.trim().split('\n');
  if (!lines.every(line => isCSVRowValid(line))) {
    return { isValid: false };
  }

  const users: UserDTO[] = [];
  lines.forEach(line => {
    const values = line.split(DELIMITER);
    const user: UserDTO = {
      email: values[3],
      student_index: values[2],
      user_name: `${values[0]} ${values[1]}`,
      user_role: ROLES.student,
    };
    users.push(user);
  });
  return { users, isValid: true };
};
