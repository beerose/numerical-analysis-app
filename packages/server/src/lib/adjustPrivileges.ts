import { GroupDTO, UserDTO, UserPrivileges, What } from 'common';

import { db } from '../store';

type AdjustCallback = (res: void | { error: string }) => void;
interface AdjustPrivilegesFunc {
  add: (
    groupId: GroupDTO['id'],
    userId: UserDTO['id'],
    privileges: What[],
    callback: AdjustCallback
  ) => void;
  update: (
    groupId: GroupDTO['id'],
    prevUserId: UserDTO['id'],
    nextUserId: UserDTO['id'],
    privileges: What[],
    callback: AdjustCallback
  ) => void;
  delete: () => void;
}

export const adjustPrivileges: AdjustPrivilegesFunc = () => null;

adjustPrivileges.add = (groupId, userId, what, callback) => {
  return db.getUserPrivileges({ userId }, (err, res) => {
    if (err) {
      return callback({ error: err.message });
    }
    let privileges: UserPrivileges;
    if (!res) {
      privileges = {
        groups: {
          [groupId]: what,
        },
      };
    } else {
      const privilegesJSON: UserPrivileges = JSON.parse(res);
      privileges = {
        groups: {
          ...privilegesJSON.groups,
          [groupId]: what,
        },
        users: privilegesJSON.users,
      };
    }

    return db.setUserPrivileges({ privileges, userId }, setErr => {
      if (setErr) {
        return callback({ error: setErr.message });
      }
      return callback();
    });
  });
};

adjustPrivileges.update = (groupId, prevUserId, nextUserId, what) => {
  return;
};

adjustPrivileges.delete = () => {
  return;
};
