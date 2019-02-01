import { What } from 'common';
import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

type Where = 'groups' | 'users';

export const can = (what: What, where: Where) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { privileges } = res.locals.user;
  if (!privileges) {
    res.send(codes.UNAUTHORIZED).send({ error: 'Access denied' });
    return;
  }
  if (where === 'groups') {
    const groupId = extractGroupId(req);
    if (!groupId) {
      res.send(codes.UNAUTHORIZED).send({ error: 'Access denied' });
      return;
    }
    if (!privileges[groupId]) {
      res
        .send(codes.UNAUTHORIZED)
        .send({ error: 'User cannot perform operation in this group' });
      return;
    }
    if (!privileges[groupId].includes(what)) {
      res
        .send(codes.UNAUTHORIZED)
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
