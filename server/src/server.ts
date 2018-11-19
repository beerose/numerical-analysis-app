import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morganBody from 'morgan-body';
import { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';

import { ROUTES } from '../../common/api';

import {
  isAuthenticated,
  loginUser,
  sendMagicLinks,
  storeUserPassword,
  validateLoginUserRequest,
  validateNewAccountRequest,
  validateNewAccountToken,
} from './auth';
import * as groups from './groups';
import { validateUploadRequest } from './groups/validation';
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

app.use(isAuthenticated);

const { USERS, GROUPS, ACCOUNTS } = ROUTES;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post(ACCOUNTS.new, validateNewAccountRequest, validateNewAccountToken, storeUserPassword);
app.post(ACCOUNTS.login, validateLoginUserRequest, loginUser);

app.get(USERS.list, users.list);
app.post(USERS.add, validateAddRequest, users.add);
app.post(USERS.update, validateUpdateRequest, users.update);
app.delete(USERS.delete, validateDeleteRequest, users.deleteUser);

app.post(GROUPS.upload, validateUploadRequest, groups.upload, sendMagicLinks);

const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on ${(listener.address() as AddressInfo).port}`);
});
