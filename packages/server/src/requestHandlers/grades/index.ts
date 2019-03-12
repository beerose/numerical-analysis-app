import { ServerRoutes, UserRole } from 'common';
import { Router } from 'express';

import { auth } from '../../middleware';

import { addGrade } from './add';

const { Grades } = ServerRoutes;
export const router = Router();

router.post(
  Grades,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  addGrade
);
