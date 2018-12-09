"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTES = {
    ACCOUNTS: {
        login: '/accounts/login',
        new: '/accounts/new',
    },
    GROUPS: {
        add_student: '/groups/students.add',
        delete_student: '/groups/students.delete',
        details: '/groups/:id',
        list: '/groups',
        students: '/groups/students.get',
        update_student: '/groups/students.update',
        upload: '/groups/upload',
    },
    USERS: {
        add: '/users/add',
        delete: '/users/delete',
        list: '/users',
        update: '/users/update',
    },
};
var GroupEnum;
(function (GroupEnum) {
    GroupEnum["Exercise"] = "\u0106wiczenia";
    GroupEnum["Lab"] = "Pracownia";
    GroupEnum["Lecture"] = "Wyk\u0142ad";
})(GroupEnum = exports.GroupEnum || (exports.GroupEnum = {}));
