export const addUserQuery = `
INSERT INTO
  users (
    user_name,
    email,
    student_index,
    created_at,
    updated_at
  )
VALUES (?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
  user_name = VALUES(user_name),
  email = VALUES(email),
  student_index = VALUES(student_index),
  created_at = VALUES(created_at),
  updated_at = VALUES(updated_at);
`;

export const deleteUserQuery = `
  DELETE FROM users WHERE email = ?;
`;
