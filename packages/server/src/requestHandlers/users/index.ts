import { ServerRoutes, UserRole } from 'common';
import { Router } from 'express';

import { auth } from '../../middleware';

import { create } from './create';
import { deleteUser } from './delete';
import { list } from './list';
import { update } from './update';

const { Users: Routes } = ServerRoutes;

export const router = Router();

router.get(Routes.List, auth.authorize([UserRole.Admin]), list);
router.post(Routes.Create, /*auth.authorize([UserRole.Admin]),*/ create);
router.post(Routes.Update, auth.authorize([UserRole.Admin]), update);
router.delete(Routes.Delete, auth.authorize([UserRole.Admin]), deleteUser);
