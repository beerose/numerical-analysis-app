import { ServerRoutes, UserRole } from 'common';
import { Router } from 'express';

import { auth } from '../../middleware';

import { create } from './create';
import { deleteUser } from './delete';
import { get } from './get';
import { list } from './list';
import * as student from './student';
import { update } from './update';

const { Users: Routes } = ServerRoutes;

export const router = Router();

router.get(
  Routes.Get(':id'),
  auth.authorize([UserRole.Admin, UserRole.SuperUser, UserRole.Student]),
  get
);
router.get(
  Routes.List,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  list
);
router.post(Routes.Create, /*auth.authorize([UserRole.Admin]),*/ create);
router.post(Routes.Update, auth.authorize([UserRole.Admin]), update);
router.delete(Routes.Delete, auth.authorize([UserRole.Admin]), deleteUser);

router.get(
  Routes.Student.Groups(':id'),
  auth.authorize([UserRole.Student]),
  student.groups
);
router.get(
  Routes.Student.Tasks(':id'),
  auth.authorize([UserRole.Student, UserRole.SuperUser, UserRole.Admin]),
  student.tasksSummary
);
router.get(
  Routes.Student.GroupGrade(':id'),
  auth.authorize(UserRole.All),
  student.getStudentWithGroup
);
