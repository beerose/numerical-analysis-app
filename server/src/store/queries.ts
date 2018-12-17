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

export const getUserRoleQuery = `
  SELECT user_role FROM users WHERE email = ?;
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

export const addMeetingQuery = `
  INSERT INTO meetings(meeting_name, date, group_id) VALUES (?, ?, ?);
`;

export const listMeetingsQuery = `
  SELECT (meeting_name, date) FROM meetings WHERE group_id = ?;
`;
