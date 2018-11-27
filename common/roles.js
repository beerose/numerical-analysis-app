"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ROLES;
(function (ROLES) {
    ROLES["admin"] = "admin";
    ROLES["superUser"] = "superUser";
    ROLES["student"] = "student";
})(ROLES = exports.ROLES || (exports.ROLES = {}));
exports.userRoleOptions = Object.keys(ROLES);
