import { ServerRoutes, UserRole } from 'common';
import { Router } from 'express';

import { auth } from '../../middleware';

import { SetTaskPoints } from './set';
import { GetGrades } from './get';

const { Grades } = ServerRoutes;
export const router = Router();

router.post(
  Grades,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  SetTaskPoints
);

router.get(
  Grades,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  GetGrades
);
