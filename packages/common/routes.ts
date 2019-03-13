export const ServerRoutes = {
  Accounts: {
    Login: '/accounts.login',
    New: '/accounts.new',
  },
  Files: '/files', // Uses many HTTP methods
  Grades: '/grades',
  Groups: {
    Create: '/groups.create',
    Delete: '/groups.delete',
    Get: '/groups.get',
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
    ShareForEdit: '/groups/shareForEdit',
    Students: {
      AddToGroup: '/groups/students.add',
      List: '/groups/students',
      RemoveFromGroup: '/groups/students.delete',
    },
    Tasks: {
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
    List: '/users',
    Update: '/users/update',
  },
};
