import { UserRole, What, Where } from 'common';
import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

export const can = (what: What, where: Where) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { privileges, user_role } = res.locals.user;
  if (user_role === UserRole.admin) {
    return next();
  }
  if (privileges) {
    res.status(codes.UNAUTHORIZED).send({ error: 'Access denied' });
    return;
  }
  const privilegesJSON = JSON.parse(privileges);
  console.log(privileges, privilegesJSON);
  if (where === 'groups') {
    const groupId = extractGroupId(req);
    if (!groupId) {
      res
        .status(codes.UNAUTHORIZED)
        .send({ error: 'Access denied - no group_id' });
      return;
    }
    if (!privilegesJSON['groups']) {
      res
        .status(codes.UNAUTHORIZED)
        .send({ error: 'Access denied - no groups in JSON' });
      return;
    }
    if (!privilegesJSON['groups'][groupId]) {
      res
        .status(codes.UNAUTHORIZED)
        .send({ error: 'User cannot perform operation in this group' });
      return;
    }
    if (!privilegesJSON['groups'][groupId].includes(what)) {
      res
        .status(codes.UNAUTHORIZED)
        .send({ error: 'User cannot perform this type of operation in group' });
      return;
    }
  }
  return next();
};

export const extractGroupId = (req: Request): number | null => {
  if (req.body && req.body.group_id) {
    return Number(req.body.group_id);
  }
  if (req.query && req.query.group_id) {
    return Number(req.query.group_id);
  }
  return null;
};
