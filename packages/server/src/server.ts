import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import stringify from 'json-stringify-pretty-compact';
import morganBody from 'morgan-body';
import { AddressInfo } from 'net';

import { apolloServer } from './graphql';
import { displayRegisteredRoutes } from './lib/displayRegisteredRoutes';
import { enhanceResponse } from './middleware/auth/enhanceResponse';
import * as requestHandlers from './requestHandlers';
import { connectToDb, disconnectFromDb } from './store/connection';

const PORT = Number(process.env.PORT) || 8082;
const HOST = process.env.HOST || 'localhost';

export const app = express();

if (process.env.NODE_ENV !== 'test') {
  morganBody(app);
}

app.use(enhanceResponse);
app.use(cors());
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
    origin: true,
  },
  path: '/graphql',
});

let server: import('http').Server;

export const startServer = () => {
  connectToDb();
  server = app.listen(PORT, HOST, () => {
    console.log(
      `Your app is listening on port: ${(server.address() as AddressInfo).port}`
    );
  });
};

export const stopServer = () => {
  server.close();
  disconnectFromDb();
};
