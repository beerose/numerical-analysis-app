import { ServerRoutes, UserRole } from 'common';
import { Router } from 'express';
import { auth } from '../../middleware';

const { Accounts: Routes } = ServerRoutes;

import { loginUser } from './loginUser';
import { checkNewAccountToken, storeUserPassword } from './newAccount';
import { changePassword } from './changePassword';

export const router = Router();

router.post(Routes.New, checkNewAccountToken, storeUserPassword);
router.post(Routes.Login, loginUser);
router.post(
  Routes.ChangePassword,
  auth.authorize([UserRole.admin, UserRole.student, UserRole.superUser]),
  changePassword
);
