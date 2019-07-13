import { UserDTO } from './api';

export const ServerRoutes = {
  Accounts: {
    ChangePassword: '/accounts/change_password',
    Login: '/accounts/login',
    New: '/accounts/new',
    ResetPassword: '/accounts/reset_password',
  },
  Files: '/files', // Uses many HTTP methods
  Grades: '/grades',
  Groups: {
    Attach: '/groups/attach',
    Create: '/groups.create',
    Delete: '/groups.delete',
    Detach: '/groups/detach',
    Get: '/groups.get',
    GetAttached: '/groups/attached',
    List: '/groups',
    Meetings: {
      AddPresence: '/groups/meetings.addPresence',
      Create: '/groups/meetings.create',
      Delete: '/groups/meetings.delete',
      DeletePresence: '/groups/meetings.deletePresence',
      Details: '/groups/meetings.details',
      List: '/groups/meetings',
      SetActivity: '/groups/meetings.setActivity',
      Update: '/groups/meetings.update',
    },
    Results: {
      Get: '/groups/results',
      SetFinal: '/groups/results.set',
    },
    // tslint:disable:object-literal-sort-keys
    ShareForEdit: '/groups/shareForEdit',
    UnshareForEdit: '/groups/unshareForEdit',
    Students: {
      AddToGroup: '/groups/students.add',
      List: '/groups/students',
      RemoveFromGroup: '/groups/students.delete',
    },
    Tasks: {
      Attach: '/groups/tasks.attach',
      Create: '/groups/tasks.create',
      Delete: '/groups/tasks.delete',
      Get: '/groups/tasks.get',
      List: '/groups/tasks.list',
      Update: '/groups/tasks.update',
    },
    Update: '/groups/update',
    Upload: '/groups/upload',
  },
  Users: {
    Create: '/users/create',
    Delete: '/users/delete',
    Get: (userId: UserDTO['id'] | ':id') => `/users/${userId}`,
    List: '/users',
    Student: {
      Groups: (userId: UserDTO['id'] | ':id') =>
        `/users/${userId}/student.groups`,
      Results: (userId: UserDTO['id'] | ':id') =>
        `/users/${userId}/student.results`,
      Tasks: (userId: UserDTO['id'] | ':id') =>
        `/users/${userId}/student.tasks`,
    },
    Update: '/users/update',
  },
} as const;
