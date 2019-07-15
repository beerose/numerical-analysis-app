import { ServerRoutes, UserRole } from 'common';
import { Router } from 'express';

import { auth } from '../../middleware';

import { attach } from './attach';
import { create } from './create';
import { deleteGroup } from './delete';
import { detach } from './detach';
import { getGroup } from './get';
import { getAttached } from './getAttached';
import { list } from './list';
import * as meetings from './meetings';
import * as results from './results';
import { share } from './shareForEdit';
import * as students from './students';
import * as tasks from './tasks';
import { unshare } from './unshareForEdit';
import { update } from './update';
import { upload } from './upload';

export const router = Router();

const { Groups: Routes } = ServerRoutes;

router.post(
  Routes.Create,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  create
);
router.get(
  Routes.List,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  list
);

// Inside a particular group
router.post(
  Routes.Upload,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  upload
  // auth.sendMagicLinks
);
router.get(
  Routes.Get,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('read', 'groups'),
  getGroup
);
router.delete(
  Routes.Delete,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  deleteGroup
);
router.post(
  Routes.Update,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  update
);
router.post(
  Routes.ShareForEdit,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  share
);
router.post(
  Routes.UnshareForEdit,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  unshare
);
router.get(
  Routes.GetAttached,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('read', 'groups'),
  getAttached
);
router.post(
  Routes.Attach,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  attach
);
router.post(
  Routes.Detach,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  detach
);

// Students
router.get(
  Routes.Students.List,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('read', 'groups'),
  students.listStudentsWithinGroup
);
router.post(
  Routes.Students.AddToGroup,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  students.addStudentToGroup
);
router.delete(
  Routes.Students.RemoveFromGroup,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  students.removeStudentFromGroup
);

// Meetings
router.get(
  Routes.Meetings.List,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('read', 'groups'),
  meetings.listMeetings
);
router.post(
  Routes.Meetings.Create,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  meetings.addMeeting
);
router.post(
  Routes.Meetings.Update,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  meetings.updateMeeting
);
router.delete(
  Routes.Meetings.Delete,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  meetings.deleteMeeting
);
router.get(
  Routes.Meetings.Details,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('read', 'groups'),
  meetings.getMeetingsDetails
);
router.post(
  Routes.Meetings.AddPresence,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  meetings.addPresence
);
router.delete(
  Routes.Meetings.DeletePresence,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  meetings.deletePresence
);
router.post(
  Routes.Meetings.SetActivity,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  meetings.setActivity
);

// Tasks
router.get(
  Routes.Tasks.List,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('read', 'groups'),
  tasks.listTasksForGroup
);
router.delete(
  Routes.Tasks.Delete,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  tasks.deleteTaskFromGroup
);
router.post(
  Routes.Tasks.Create,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  tasks.createTask
);
router.get(
  Routes.Tasks.Get,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('read', 'groups'),
  tasks.getTask
);
router.post(
  Routes.Tasks.Update,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  tasks.updateTask
);
router.post(
  Routes.Tasks.Attach,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  tasks.attachTask
);

// results
router.get(
  Routes.Results.Get,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('read', 'groups'),
  results.getResults
);

router.post(
  Routes.Results.SetFinal,
  auth.authorize([UserRole.Admin, UserRole.SuperUser]),
  auth.can('edit', 'groups'),
  results.setFinalGrade
);
