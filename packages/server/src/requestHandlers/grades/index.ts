import { ServerRoutes, UserRole } from 'common';
import { Router } from 'express';

import { auth } from '../../middleware';

import { GetGrades } from './get';
import { setTaskPoints } from './set';

const { Grades } = ServerRoutes;
export const router = Router();

router.post(
  Grades,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  setTaskPoints
);

router.get(
  Grades,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  GetGrades
);
