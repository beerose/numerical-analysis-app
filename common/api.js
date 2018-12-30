"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: function l<T extends string>(s: T): T;
exports.Routes = {
    Accounts: {
        Login: '/accounts/login',
        New: '/accounts/new',
    },
    Groups: {
        Create: '/groups/create',
        Delete: '/groups/delete',
        Get: '/groups/:id',
        List: '/groups',
        Meetings: {
            Create: '/groups/meetings.create',
            Delete: '/groups/meetings.delete',
            Details: '/groups/meetings.details',
            List: '/groups/meetings',
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
var GroupEnumUI;
(function (GroupEnumUI) {
    GroupEnumUI["Exercise"] = "\u0106wiczenia";
    GroupEnumUI["Lab"] = "Pracownia";
    GroupEnumUI["Lecture"] = "Wyk\u0142ad";
})(GroupEnumUI = exports.GroupEnumUI || (exports.GroupEnumUI = {}));
