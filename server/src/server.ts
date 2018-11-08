import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morganBody from 'morgan-body';
import { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';

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

app.get('/users', isAuthenticated, users.list);
app.post('/users/add', isAuthenticated, validateAddRequest, users.add);
app.post('/users/update', isAuthenticated, validateUpdateRequest, users.update);
app.delete('/users/delete', isAuthenticated, validateDeleteRequest, users.deleteUser);

const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on ${(listener.address() as AddressInfo).port}`);
});
