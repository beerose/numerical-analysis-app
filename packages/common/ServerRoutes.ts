import { UserId } from './domain';

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
      Upload: '/groups/students.upload',
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
  },
  Users: {
    Create: '/users/create',
    Delete: '/users/delete',
    Get: (userId: UserId | ':id') => `/users/${userId}`,
    List: '/users',
    SendInvitation: '/accounts/send_invitation',
    Student: {
      // TODO: Make Student a fuction -- it will resemble routes better
      Groups: (userId: UserId | ':id') => `/users/${userId}/student.groups`,
      Results: (userId: UserId | ':id') => `/users/${userId}/student.results`,
      Tasks: (userId: UserId | ':id') => `/users/${userId}/student.tasks`,
      GroupGrade: (userId: UserId | ':id') =>
        `/users/${userId}/student.groupGrade`,
    },
    Update: '/users/update',
  },
} as const;
