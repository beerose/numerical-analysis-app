import { ServerRoutes } from 'common';
import { Router } from 'express';

const { Accounts: Routes } = ServerRoutes;

import { loginUser } from './loginUser';
import { checkNewAccountToken, storeUserPassword } from './newAccount';

export const router = Router();

router.post(Routes.New, checkNewAccountToken, storeUserPassword);
router.post(Routes.Login, loginUser);
