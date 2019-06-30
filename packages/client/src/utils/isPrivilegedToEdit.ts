import { GroupDTO, UserDTO } from 'common';

export const isAlreadyPrivilegedToEdit = (
  user: UserDTO,
  groupId?: GroupDTO['id']
) => {
  if (!groupId || !user.privileges || !user.privileges.groups) {
    return false;
  }
  if (
    !(user.privileges.groups[groupId] && user.privileges.groups[groupId].length)
  ) {
    return false;
  }
  if (!user.privileges.groups[groupId].includes('edit')) {
    return false;
  }
  return true;
};
