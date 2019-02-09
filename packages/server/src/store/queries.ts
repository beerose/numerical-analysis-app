import { GroupDTO } from 'common';

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

// tslint:disable:no-nested-template-literals
export const prepareAttachStudentToGroupQuery = (
  userEmails: string[],
  groupId: GroupDTO['id']
) => `
  INSERT IGNORE INTO user_belongs_to_group(user_id, group_id)
  VALUES ${userEmails
    .map(
      email => `((SELECT id FROM users WHERE email = "${email}"), ${groupId})`
    )
    .join(',')};
`;
