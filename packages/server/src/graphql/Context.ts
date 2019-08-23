import { GroupId, UserDTO } from 'common';

export type Context = {
  user: UserDTO;
  groupId: GroupId;
};
