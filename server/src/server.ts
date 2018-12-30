import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morganBody from 'morgan-body';
import { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';

import { Routes } from '../../common/api';

import * as auth from './auth';
import { validateLoginUserRequest, validateNewAccountRequest } from './auth/validation';
import * as groups from './groups';
import {
  validateAddMeetingRequest,
  validateAddStudentToGroupRequest,
  validateCreateGroupRequest,
  validateDeleteGroupRequest,
  validateDeleteMeetingRequest,
  validateGetMeetingsDetailsRequest,
  validateListStudentsForGroupRequest,
  validateUploadRequest,
} from './groups/validation';
import * as swaggerDocument from './swagger.json';
import * as users from './users';
import {
  validateAddRequest,
  validateDeleteRequest,
  validateUpdateRequest,
} from './users/validation';

const PORT = process.env.PORT;

const app = express();

morganBody(app);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const { Users, Groups, Accounts } = Routes;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post(
  Accounts.New,
  validateNewAccountRequest,
  auth.checkNewAccountToken,
  auth.storeUserPassword
);
app.post(Accounts.Login, validateLoginUserRequest, auth.loginUser);

app.get(Users.List, auth.authorize, users.list);
app.post(Users.Create, auth.authorize, validateAddRequest, users.create);
app.post(Users.Update, auth.authorize, validateUpdateRequest, users.update);
app.delete(Users.Delete, auth.authorize, validateDeleteRequest, users.deleteUser);

app.post(Groups.Create, auth.authorize, validateCreateGroupRequest, groups.create);
app.post(Groups.Upload, auth.authorize, validateUploadRequest, groups.upload, auth.sendMagicLinks);
app.get(Groups.List, auth.authorize, groups.list);
app.get(
  Groups.Students.List,
  auth.authorize,
  validateListStudentsForGroupRequest,
  groups.listStudentsForGroup
);
app.delete(Groups.Delete, auth.authorize, validateDeleteGroupRequest, groups.deleteGroup);

app.post(
  Groups.Students.AddToGroup,
  auth.authorize,
  validateAddStudentToGroupRequest,
  groups.addStudentToGroup
);

app.get(Groups.Meetings.List, auth.authorize, groups.listMeetings);
app.post(Groups.Meetings.Create, auth.authorize, validateAddMeetingRequest, groups.addMeeting);
app.delete(
  Groups.Meetings.Delete,
  auth.authorize,
  validateDeleteMeetingRequest,
  groups.deleteMeeting
);
app.get(
  Groups.Meetings.Details,
  auth.authorize,
  validateGetMeetingsDetailsRequest,
  groups.getMeetingsDetails
);

const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on ${(listener.address() as AddressInfo).port}`);
});
