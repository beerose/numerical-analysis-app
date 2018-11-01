export const addUserQuery = `
INSERT INTO
  users (
    user_name,
    email,
    student_index,
    user_role,
    created_at,
    updated_at
  )
VALUES (?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
  user_name = VALUES(user_name),
  email = VALUES(email),
  student_index = VALUES(student_index),
  user_role = VALUES(user_role),
  created_at = VALUES(created_at),
  updated_at = VALUES(updated_at);
`;

export const deleteUserQuery = `
  DELETE FROM users WHERE email = ?;
`;

export const getUserRoleQuery = `
  SELECT user_role FROM users WHERE email = ?;
`;

const searchSubQuery = (searchParam: string) => `
  (MATCH(user_name) AGAINST (${searchParam})
  OR MATCH(email) AGAINST (${searchParam})
  OR MATCH(index) AGAINST (${searchParam}))
`;

const roleSubQuery = (role: string) => `
  user_role = ${role}
`;

export const listUsersQuery = (
  searchParam?: string,
  role?: string
) => `
  SELECT
    *
  FROM
    users
  ${searchParam || role ? 'WHERE' : ''}
  ${searchParam ? searchSubQuery(searchParam) : ''}
  ${searchParam && role ? 'OR' : ''}
  ${role ? roleSubQuery(role) : ''}
  ORDER_BY updated_at
  LIMIT ? OFFSET ?;
`;
