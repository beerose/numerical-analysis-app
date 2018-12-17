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
        Get: '/groups/:id',
        List: '/groups',
        Meetings: {
            Create: '/groups/meetings.create',
            Delete: '/groups/meetings.delete',
            List: '/groups/meetings',
        },
        Students: {
            AddToGroup: '/groups/students.add',
            List: '/groups/students',
            RemoveFromGroup: '/groups/students.delete',
            UpdateStudent: '/groups/students.update',
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
