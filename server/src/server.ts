import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morganBody from 'morgan-body';
import { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';

import { ROUTES } from '../../common/api';

import * as auth from './auth';
import { validateLoginUserRequest, validateNewAccountRequest } from './auth/validation';
import * as groups from './groups';
import {
  validateAddMeetingRequest,
  validateAddStudentToGroupRequest,
  validateDeleteStudentFromGroupRequest,
  validateListStudentsForGroupRequest,
  validateUpdateStudentRequest,
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

const { USERS, GROUPS, ACCOUNTS } = ROUTES;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post(
  ACCOUNTS.new,
  validateNewAccountRequest,
  auth.checkNewAccountToken,
  auth.storeUserPassword
);
app.post(ACCOUNTS.login, validateLoginUserRequest, auth.loginUser);

app.get(USERS.list, auth.authorize, users.list);
app.post(USERS.create, auth.authorize, validateAddRequest, users.create);
app.post(USERS.update, auth.authorize, validateUpdateRequest, users.update);
app.delete(USERS.delete, auth.authorize, validateDeleteRequest, users.deleteUser);

app.post(GROUPS.upload, auth.authorize, validateUploadRequest, groups.upload, auth.sendMagicLinks);
app.get(GROUPS.list, auth.authorize, groups.list);
app.get(
  GROUPS.students,
  auth.authorize,
  validateListStudentsForGroupRequest,
  groups.listStudentsForGroup
);
app.delete(
  GROUPS.delete_student,
  auth.authorize,
  validateDeleteStudentFromGroupRequest,
  groups.deleteUserFromGroup
);
app.post(GROUPS.update_student, auth.authorize, validateUpdateStudentRequest, groups.updateStudent);
app.post(
  GROUPS.add_student,
  auth.authorize,
  validateAddStudentToGroupRequest,
  groups.addStudentToGroup
);
app.post(GROUPS.add_meetings, auth.authorize, validateAddMeetingRequest, groups.addMeeting);
app.post(GROUPS.add, auth.authorize, groups.add);

const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on ${(listener.address() as AddressInfo).port}`);
});
