import { GroupDTO, UserDTO, What } from 'common';

interface AdjustPrivilegesFunc {
  add: (
    groupId: GroupDTO['id'],
    userId: UserDTO['id'],
    privileges: What[]
  ) => void | { error: string };
  update: (
    groupId: GroupDTO['id'],
    prevUserId: UserDTO['id'],
    nextUserId: UserDTO['id'],
    privileges: What[]
  ) => void | { error: string };
  delete: () => void;
}

export const adjustPrivileges: AdjustPrivilegesFunc = () => null;

adjustPrivileges.add = (groupId, userId, what) => {
  return { error: 'error' };
};

adjustPrivileges.update = (groupId, prevUserId, nextUserId, what) => {
  return;
};

adjustPrivileges.delete = () => {
  return;
};
