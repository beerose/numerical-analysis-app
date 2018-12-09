import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morganBody from 'morgan-body';
import { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';

import { ROUTES } from '../../common/api';

import {
  checkIfTokenExpired,
  isAuthenticated,
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
  validateDeleteStudentFromGroupRequest,
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

const { USERS, GROUPS, ACCOUNTS } = ROUTES;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post(
  ACCOUNTS.new,
  validateNewAccountRequest,
  checkIfTokenExpired,
  validateNewAccountToken,
  storeUserPassword,
  storeToken
);
app.post(ACCOUNTS.login, validateLoginUserRequest, loginUser);

app.get(USERS.list, isAuthenticated, users.list);
app.post(USERS.add, isAuthenticated, validateAddRequest, users.add);
app.post(USERS.update, isAuthenticated, validateUpdateRequest, users.update);
app.delete(USERS.delete, isAuthenticated, validateDeleteRequest, users.deleteUser);

app.post(GROUPS.upload, isAuthenticated, validateUploadRequest, groups.upload, sendMagicLinks);
app.get(GROUPS.list, isAuthenticated, groups.list);
app.get(
  GROUPS.students,
  isAuthenticated,
  validateListStudentsForGroupRequest,
  groups.listStudentsForGroup
);
app.delete(
  GROUPS.delete_student,
  isAuthenticated,
  validateDeleteStudentFromGroupRequest,
  groups.deleteUserFromGroup
);

const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on ${(listener.address() as AddressInfo).port}`);
});
