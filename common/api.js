"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTES = {
    ACCOUNTS: {
        login: '/accounts/login',
        new: '/accounts/new',
    },
    GROUPS: {
        list: '/groups',
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
