import { ServerRoutes, UserRole } from 'common';
import { Router } from 'express';

import { auth } from '../../middleware';

import { create } from './create';
import { deleteGroup } from './delete';
import { getGroup } from './get';
import { list } from './list';
import * as meetings from './meetings';
import { share } from './shareForEdit';
import * as students from './students';
import * as tasks from './tasks';
import * as results from './results';
import { update } from './update';
import { upload } from './upload';
import { getAttached } from './getAttached';

export const router = Router();

const { Groups: Routes } = ServerRoutes;

router.post(
  Routes.Create,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  create
);
router.get(
  Routes.List,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  list
);

// Inside a particular group
router.post(
  Routes.Upload,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  upload
  // auth.sendMagicLinks
);
router.get(
  Routes.Get,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  getGroup
);
router.delete(
  Routes.Delete,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  deleteGroup
);
router.post(
  Routes.Update,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  update
);
router.post(
  Routes.ShareForEdit,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  share
);
router.get(
  Routes.GetAttached,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  getAttached
);

router.get(
  Routes.Students.List,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  students.listStudentsWithGroups
);
router.post(
  Routes.Students.AddToGroup,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  students.addStudentToGroup
);
router.delete(
  Routes.Students.RemoveFromGroup,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  students.removeStudentFromGroup
);

router.get(
  Routes.Meetings.List,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  meetings.listMeetings
);
router.post(
  Routes.Meetings.Create,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  meetings.addMeeting
);
router.post(
  Routes.Meetings.Update,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  meetings.updateMeeting
);
router.delete(
  Routes.Meetings.Delete,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  meetings.deleteMeeting
);
router.get(
  Routes.Meetings.Details,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  meetings.getMeetingsDetails
);
router.post(
  Routes.Meetings.AddPresence,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  meetings.addPresence
);
router.delete(
  Routes.Meetings.DeletePresence,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  meetings.deletePresence
);
router.post(
  Routes.Meetings.SetActivity,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  meetings.setActivity
);

// Tasks
router.get(
  Routes.Tasks.List,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  tasks.listTasksForGroup
);
router.delete(
  Routes.Tasks.Delete,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  tasks.deleteTaskFromGroup
);
router.post(
  Routes.Tasks.Create,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  tasks.createTask
);
router.get(
  Routes.Tasks.Get,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  tasks.getTask
);
router.post(
  Routes.Tasks.Update,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  tasks.updateTask
);

// results
router.get(
  Routes.Results.Get,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  results.getResults
);

router.post(
  Routes.Results.SetFinal,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  results.setFinalGrade
);
