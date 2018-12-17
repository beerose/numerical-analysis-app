import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morganBody from 'morgan-body';
import { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';

import { ROUTES } from '../../common/api';

import {
  isAuthorized,
  loginUser,
  sendMagicLinks,
  storeToken,
  storeUserPassword,
  validateLoginUserRequest,
  validateNewAccountRequest,
  validateNewAccountToken,
} from './auth';
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

app.post(ACCOUNTS.new, validateNewAccountRequest, validateNewAccountToken, storeUserPassword);
app.post(ACCOUNTS.login, validateLoginUserRequest, loginUser);

app.get(USERS.list, isAuthorized, users.list);
app.post(USERS.create, isAuthorized, validateAddRequest, users.create);
app.post(USERS.update, isAuthorized, validateUpdateRequest, users.update);
app.delete(USERS.delete, isAuthorized, validateDeleteRequest, users.deleteUser);

app.post(GROUPS.upload, isAuthorized, validateUploadRequest, groups.upload, sendMagicLinks);
app.get(GROUPS.list, isAuthorized, groups.list);
app.get(
  GROUPS.students,
  isAuthorized,
  validateListStudentsForGroupRequest,
  groups.listStudentsForGroup
);
app.delete(
  GROUPS.delete_student,
  isAuthorized,
  validateDeleteStudentFromGroupRequest,
  groups.deleteUserFromGroup
);
app.post(GROUPS.update_student, isAuthorized, validateUpdateStudentRequest, groups.updateStudent);
app.post(
  GROUPS.add_student,
  isAuthorized,
  validateAddStudentToGroupRequest,
  groups.addStudentToGroup
);
app.post(GROUPS.add_meetings, isAuthorized, validateAddMeetingRequest, groups.addMeeting);
app.post(GROUPS.add, isAuthorized, groups.add);

const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on ${(listener.address() as AddressInfo).port}`);
});
