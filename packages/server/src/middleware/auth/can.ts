import { GroupId, UserDTO, UserPrivileges, UserRole } from 'common';
import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

type UserWithStringPrivileges = UserDTO & { privileges: string };

export const can = (what: UserPrivileges.What, where: UserPrivileges.Where) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { privileges, user_role } = res.locals.user as UserWithStringPrivileges;
  if (user_role === UserRole.Admin) {
    return next();
  }
  /**
   * Is `read` needed anymore?
   */
  if (user_role === UserRole.SuperUser && what === 'read') {
    return next();
  }

  if (!privileges) {
    res.status(codes.UNAUTHORIZED).send({ error: 'Access denied' });
    return;
  }
  if (where === 'groups') {
    const groupId = extractGroupId(req);
    if (!groupId) {
      res
        .status(codes.UNAUTHORIZED)
        .send({ error: 'Access denied - no group_id' });
      return;
    }
    if (!privileges.groups) {
      res
        .status(codes.UNAUTHORIZED)
        .send({ error: 'Access denied - no groups in JSON' });
      return;
    }
    if (!privileges.groups[groupId]) {
      res
        .status(codes.UNAUTHORIZED)
        .send({ error: 'User cannot perform operation in this group' });
      return;
    }
    if (!privileges.groups[groupId].includes(what)) {
      res
        .status(codes.UNAUTHORIZED)
        .send({ error: 'User cannot perform this type of operation in group' });
      return;
    }
  }
  return next();
};

export const extractGroupId = (req: Request) => {
  if (req.body && req.body.group_id) {
    return GroupId(Number(req.body.group_id));
  }
  if (req.query && req.query.group_id) {
    return GroupId(Number(req.query.group_id));
  }
  return null;
};
