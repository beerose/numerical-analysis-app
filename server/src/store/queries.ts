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
INSERT IGNORE INTO
  users (
    user_name,
    email,
    user_role,
    student_index
  )
VALUES ?
`;

export const deleteUserQuery = `
  DELETE FROM users WHERE id = ?;
`;

export const getUserRoleQuery = `
  SELECT user_role FROM users WHERE email = ?;
`;

export const getUserByEmailQuery = `
  SELECT user_name, user_role FROM users WHERE email = ?;
`;

export const setUserPasswordQuery = `
  UPDATE users SET password = ? WHERE email = ?;
`;

export const getWholeUserByEmailQuery = `
  SELECT * FROM users WHERE email = ?;
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

export const findTokenQuery = `
  SELECT * FROM token WHERE token = ?;
`;

export const storeTokenQuery = `
  INSERT INTO token(token) VALUES (?);
`;

export const listGroupsQuery = `
  SELECT
    g.id,
    group_name,
    group_type,
    academic_year,
    class,
    g.data
  FROM
    \`groups\` g;
`;

export const listStudentsForGroupQuery = `
  SELECT
    id, user_name, email, student_index
  FROM
    users as u
  WHERE id IN (
    SELECT
      user_id
    FROM
      user_belongs_to_group
    WHERE
      group_id = ?
  );
`;

export const deleteStudentFromGroupQuery = `
  DELETE FROM user_belongs_to_group WHERE user_id = ?;
`;

export const prepareAttachStudentToGroupQuery = (userEmails: string[], groupId: string) => `
  INSERT IGNORE INTO user_belongs_to_group(user_id, group_id)
  VALUES ${userEmails
    .map(email => `((SELECT id FROM users WHERE email = "${email}"), ${groupId})`)
    .join(',')};
`;

export const addGroupQuery = `
  insert into \`groups\` (
    group_name, group_type, class, parent_group, academic_year, data
  ) values (
    ?, ?, ?, ?, ?, ?
  )
`;
