"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTES = {
    ACCOUNTS: {
        login: '/accounts/login',
        new: '/accounts/new',
    },
    GROUPS: {
        add: '/groups/add',
        add_meetings: '/groups/meetings.add',
        add_student: '/groups/students.add',
        delete_student: '/groups/students.delete',
        details: '/groups/:id',
        list: '/groups',
        list_meetings: 'groups/meetings',
        students: '/groups/students.get',
        update_student: '/groups/students.update',
        upload: '/groups/upload',
    },
    USERS: {
        create: '/users/create',
        delete: '/users/delete',
        list: '/users',
        update: '/users/update',
    },
};
var GroupEnumUI;
(function (GroupEnumUI) {
    GroupEnumUI["Exercise"] = "\u0106wiczenia";
    GroupEnumUI["Lab"] = "Pracownia";
    GroupEnumUI["Lecture"] = "Wyk\u0142ad";
})(GroupEnumUI = exports.GroupEnumUI || (exports.GroupEnumUI = {}));
