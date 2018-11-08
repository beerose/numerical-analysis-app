export const addUserQuery = `
INSERT INTO
  users (
    user_name,
    email,
    user_role,
    student_index
  )
VALUES (?, ?, ?, ?);
`;

export const updateUserQuery = `
UPDATE
  users
SET
  email = ?,
  user_name = ?,
  user_role = ?,
  student_index = ?
WHERE id = ?;
`;

export const deleteUserQuery = `
  DELETE FROM users WHERE id = ?;
`;

export const getUserRoleQuery = `
  SELECT user_role FROM users WHERE email = ?;
`;

const searchSubQuery = (searchParam: string) => `
  (MATCH(user_name) AGAINST ("${searchParam}")
  OR MATCH(email) AGAINST ("${searchParam}")
  OR MATCH(student_index) AGAINST ("${searchParam}"))
`;

const roleSubQuery = (role: string) => `
  user_role = "${role}"
`;

export const prepareListUsersQuery = (searchParam?: string, role?: string) => `
  SELECT
    id, user_name, email, student_index, user_role
  FROM
    users
  ${searchParam || role ? 'WHERE' : ''}
  ${searchParam ? searchSubQuery(searchParam) : ''}
  ${searchParam && role ? 'OR' : ''}
  ${role ? roleSubQuery(role) : ''}
  ORDER BY updated_at DESC
  LIMIT ? OFFSET ?;
`;
