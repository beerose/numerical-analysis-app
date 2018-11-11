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

export const upsertUserQuery = `
INSERT INTO
  users (
    user_name,
    email,
    user_role,
    student_index,
    course_group
  )
VALUES ?
ON DUPLICATE KEY UPDATE course_group = VALUES(course_group);
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

const roleSubQuery = (roles: string | string[]) => {
  if (typeof roles === 'string') {
    return `user_role = ("${roles}")`;
  }
  return `user_role IN (${roles.map(role => `"${role}"`)})`;
};

export const prepareListUsersQuery = (searchParam?: string, roles?: string | string[]) => `
  SELECT
    id, user_name, email, student_index, user_role
  FROM
    users
  ${searchParam || roles ? 'WHERE' : ''}
  ${searchParam ? searchSubQuery(searchParam) : ''}
  ${searchParam && roles ? 'AND' : ''}
  ${roles ? roleSubQuery(roles) : ''}
  ORDER BY updated_at DESC
  LIMIT ? OFFSET ?;
`;

export const prepareCountUsersQuery = (searchParam?: string, roles?: string | string[]) => `
  SELECT
    count(*) as total
  FROM
    users
  ${searchParam || roles ? 'WHERE' : ''}
  ${searchParam ? searchSubQuery(searchParam) : ''}
  ${searchParam && roles ? 'AND' : ''}
  ${roles ? roleSubQuery(roles) : ''};
`;
