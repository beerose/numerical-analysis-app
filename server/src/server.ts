import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morganBody from 'morgan-body';
import { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';

import { ROUTES } from '../../common/api';

import { isAuthenticated } from './auth';
import * as swaggerDocument from './swagger.json';
import * as users from './users';
import {
  validateAddRequest,
  validateDeleteRequest,
  validateUpdateRequest,
} from './users/validation';

const PORT = 3000;

const app = express();

morganBody(app);
app.use(cors());
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', isAuthenticated, (_req: Request, res: Response, _next: NextFunction) =>
  res.status(200).send('Hello ;)')
);

const { USERS } = ROUTES;
app.get(USERS.list, isAuthenticated, users.list);
app.post(USERS.add, isAuthenticated, validateAddRequest, users.add);
app.post(USERS.update, isAuthenticated, validateUpdateRequest, users.update);
app.delete(USERS.delete, isAuthenticated, validateDeleteRequest, users.deleteUser);
app.post(USERS.upload, isAuthenticated, users.upload);

const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on ${(listener.address() as AddressInfo).port}`);
});
