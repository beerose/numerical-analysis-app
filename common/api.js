"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: function l<T extends string>(s: T): T;
exports.ServerRoutes = {
    Accounts: {
        Login: '/accounts/login',
        New: '/accounts/new',
    },
    Groups: {
        Create: '/groups/create',
        Delete: '/groups/delete',
        Get: '/groups',
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
        Students: {
            AddToGroup: '/groups/students.add',
            List: '/groups/students',
            RemoveFromGroup: '/groups/students.delete',
        },
        Upload: '/groups/upload',
    },
    Users: {
        Create: '/users/create',
        Delete: '/users/delete',
        List: '/users',
        Update: '/users/update',
    },
};
var UserRole;
(function (UserRole) {
    UserRole["admin"] = "admin";
    UserRole["superUser"] = "superUser";
    UserRole["student"] = "student";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
exports.userRoleOptions = Object.values(UserRole);
var GroupType;
(function (GroupType) {
    GroupType["LAB"] = "lab";
    GroupType["EXERCISE"] = "exercise";
    GroupType["LECTURE"] = "lecture";
})(GroupType = exports.GroupType || (exports.GroupType = {}));
var GroupEnumUI;
(function (GroupEnumUI) {
    GroupEnumUI["Exercise"] = "\u0106wiczenia";
    GroupEnumUI["Lab"] = "Pracownia";
    GroupEnumUI["Lecture"] = "Wyk\u0142ad";
})(GroupEnumUI = exports.GroupEnumUI || (exports.GroupEnumUI = {}));
