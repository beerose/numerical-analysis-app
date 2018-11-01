import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';

import { isAuthenticated } from './auth';
import * as swaggerDocument from './swagger.json';
import * as users from './users';

const PORT = 3000;

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get(
  '/',
  isAuthenticated,
  (_req: Request, res: Response, _next: NextFunction) =>
    res.status(200).send('Hello ;)')
);

app.get('/users', isAuthenticated, users.list);
app.post('/users/add', isAuthenticated, users.add);
app.post('/users/update', isAuthenticated, users.update);
app.delete('/users/delete', isAuthenticated, users.deleteUser);

const listener = app.listen(process.env.PORT || PORT, () => {
  console.log(
    `Your app is listening on ${
      (listener.address() as AddressInfo).port
    }`
  );
});
