import * as bodyParser from 'body-parser';
import { ServerRoutes } from 'common';
import cors from 'cors';
import express from 'express';
import morganBody from 'morgan-body';
import { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';

import * as auth from './auth';
import * as groups from './groups';
import * as swaggerDocument from './swagger.json';
import * as users from './users';

const PORT = process.env.PORT;

const app = express();

morganBody(app);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const { Users, Groups, Accounts } = ServerRoutes;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post(Accounts.New, auth.checkNewAccountToken, auth.storeUserPassword);
app.post(Accounts.Login, auth.loginUser);

app.get(Users.List, auth.authorize, users.list);
app.post(Users.Create, auth.authorize, users.create);
app.post(Users.Update, auth.authorize, users.update);
app.delete(Users.Delete, auth.authorize, users.deleteUser);

// Groups
app.post(Groups.Create, auth.authorize, groups.create);
app.post(Groups.Upload, auth.authorize, groups.upload, auth.sendMagicLinks);
app.get(Groups.List, auth.authorize, groups.list);
app.get(Groups.Students.List, auth.authorize, groups.listStudentsForGroup);
app.delete(Groups.Delete, auth.authorize, groups.deleteGroup);

app.post(Groups.Students.AddToGroup, auth.authorize, groups.addStudentToGroup);

app.get(Groups.Meetings.List, auth.authorize, groups.listMeetings);
app.post(Groups.Meetings.Create, auth.authorize, groups.addMeeting);
app.post(Groups.Meetings.Update, auth.authorize, groups.updateMeeting);
app.delete(Groups.Meetings.Delete, auth.authorize, groups.deleteMeeting);
app.get(Groups.Meetings.Details, auth.authorize, groups.getMeetingsDetails);
app.post(Groups.Meetings.AddPresence, auth.authorize, groups.addPresence);
app.delete(
  Groups.Meetings.DeletePresence,
  auth.authorize,
  groups.deletePresence
);
app.post(Groups.Meetings.SetActivity, auth.authorize, groups.setActivity);
app.get(Groups.Get, auth.authorize, groups.get);

const listener = app.listen(PORT, () => {
  console.log(
    `Your app is listening on port: ${(listener.address() as AddressInfo).port}`
  );
});
