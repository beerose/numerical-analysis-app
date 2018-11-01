import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { AddressInfo } from 'net';

import { isAuthenticated } from './auth';

const PORT = 3000;

console.log('Running.');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.get(
  '/',
  isAuthenticated,
  (_req: Request, res: Response, _next: NextFunction) =>
    res.status(200).send('Hello ;)')
);

const listener = app.listen(process.env.PORT || PORT, () => {
  console.log(
    `Your app is listening on ${
      (listener.address() as AddressInfo).port
    }`
  );
});
