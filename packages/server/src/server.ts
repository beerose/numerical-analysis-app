import * as bodyParser from 'body-parser';
import { ServerRoutes, UserRole } from 'common';
import cors from 'cors';
import express from 'express';
import morganBody from 'morgan-body';
import { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';

import * as auth from './auth';
import * as groups from './groups';
import { connectToDb } from './store/connection';
import * as swaggerDocument from './swagger.json';
import * as users from './users';

connectToDb();

const PORT = process.env.PORT;

export const app = express();

morganBody(app);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const { Users, Groups, Accounts } = ServerRoutes;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (_, res) => {
  res.send('Hello! 👋');
});

app.post(Accounts.New, auth.checkNewAccountToken, auth.storeUserPassword);
app.post(Accounts.Login, auth.loginUser);

app.get(Users.List, auth.authorize([UserRole.admin]), users.list);
app.post(Users.Create, auth.authorize([UserRole.admin]), users.create);
app.post(Users.Update, auth.authorize([UserRole.admin]), users.update);
app.delete(Users.Delete, auth.authorize([UserRole.admin]), users.deleteUser);

// Outside a particular group
app.post(
  Groups.Create,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.create
);
app.get(
  Groups.List,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  groups.list
);

// Inside a particular group
app.post(
  Groups.Upload,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.upload,
  auth.sendMagicLinks
);
app.get(
  Groups.Get,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  groups.getGroup
);
app.delete(
  Groups.Delete,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.deleteGroup
);
app.get(
  Groups.Students.List,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  groups.listStudentsForGroup
);
app.post(
  Groups.Students.AddToGroup,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.addStudentToGroup
);
app.delete(
  Groups.Students.RemoveFromGroup,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.removeStudentFromGroup
);

app.get(
  Groups.Meetings.List,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  groups.listMeetings
);
app.post(
  Groups.Meetings.Create,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.addMeeting
);
app.post(
  Groups.Meetings.Update,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.updateMeeting
);
app.delete(
  Groups.Meetings.Delete,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.deleteMeeting
);
app.get(
  Groups.Meetings.Details,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('read', 'groups'),
  groups.getMeetingsDetails
);
app.post(
  Groups.Meetings.AddPresence,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.addPresence
);
app.delete(
  Groups.Meetings.DeletePresence,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.deletePresence
);
app.post(
  Groups.Meetings.SetActivity,
  auth.authorize([UserRole.admin, UserRole.superUser]),
  auth.can('edit', 'groups'),
  groups.setActivity
);

const listener = app.listen(PORT, () => {
  console.log(
    `Your app is listening on port: ${(listener.address() as AddressInfo).port}`
  );
});
