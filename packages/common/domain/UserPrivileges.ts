import { GroupDTO } from './Group';

export namespace UserPrivileges {
  export type Where = 'groups' | 'users';
  export type What = 'edit' | 'read';
}

export type UserPrivileges = {
  [key in UserPrivileges.Where]?: Record<GroupDTO['id'], UserPrivileges.What[]>
};
