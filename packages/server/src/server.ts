// tslint:disable: no-http-string non-literal-fs-path

import * as bodyParser from 'body-parser';
import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import stringify from 'json-stringify-pretty-compact';
import morganBody from 'morgan-body';
import { join } from 'path';

import { apolloServer } from './graphql';
import { echo } from './lib';
import { displayRegisteredRoutes } from './lib/displayRegisteredRoutes';
import { enhanceResponse } from './middleware/auth/enhanceResponse';
import * as requestHandlers from './requestHandlers';
import { connectToDb, disconnectFromDb } from './store/connection';

const PORT = Number(process.env.PORT) || 8082;
const HTTPS_PORT = Number(process.env.HTTPS_PORT) || PORT + 1;
const HOST = process.env.HOST || 'localhost';

export const app = express();

if (process.env.NODE_ENV !== 'test') {
  morganBody(app);
}

app.use(enhanceResponse);
app.use(cors());
// app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
// app.use(/\/((?!graphql).)*/, bodyParser.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.type('json').send(
    stringify({
      message: `Hello! 👋 ${new Date().toLocaleString()}`,
      routes: displayRegisteredRoutes(app),
    })
  );
});

app.use(requestHandlers.accountsRouter);
app.use(requestHandlers.filesRouter);
app.use(requestHandlers.groupsRouter);
app.use(requestHandlers.usersRouter);
app.use(requestHandlers.gradesRouter);

apolloServer.applyMiddleware({
  app,
  cors: {
    credentials: true,
    origin: ['https://rno.ii.uni.wroc.pl/*', 'http://localhost'],
  },
  path: '/graphql',
});

const httpsOptions = {
  key: fs.readFileSync(join(process.env.CERT_PATH!, 'key.pem')),
  cert: fs.readFileSync(join(process.env.CERT_PATH!, 'cert.pem')),
};

let servers: Array<http.Server | https.Server>;

export const startServer = () => {
  connectToDb();

  servers =
    process.env.NODE_ENV !== 'production'
      ? [http.createServer(app).listen(PORT, HOST)]
      : [https.createServer(httpsOptions, app).listen(HTTPS_PORT, HOST)];

  servers.forEach(s => apolloServer.installSubscriptionHandlers(s));

  echo`
    Your app is listening on
      ${servers.map(s => `- ${chalk.blue(String(s.address()))}`).join('\n')}
      - ${chalk.blue(`http://${HOST}:${PORT}`)}
      - ${chalk.blue(`https://${HOST}:${HTTPS_PORT}`)}
  `;
};

export const stopServer = () => {
  servers.forEach(s => s.close());
  disconnectFromDb();
};
