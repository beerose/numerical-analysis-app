import { ServerRoutes, UserRole } from 'common';
import { Router } from 'express';

import { auth } from '../../middleware';

import { changePassword } from './changePassword';
import { loginUser } from './loginUser';
import { checkNewAccountToken, storeUserPassword } from './newAccount';
import { resetPassword } from './resetPassword';

const { Accounts: Routes } = ServerRoutes;

export const router = Router();

router.post(Routes.New, checkNewAccountToken, storeUserPassword);
router.post(Routes.Login, loginUser);
router.post(
  Routes.ChangePassword,
  auth.authorize([UserRole.Admin, UserRole.SuperUser, UserRole.Student]),
  changePassword
);
router.post(Routes.ResetPassword, resetPassword);
