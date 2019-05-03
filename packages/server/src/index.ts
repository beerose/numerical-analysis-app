import dotenv from 'dotenv';

console.log('Loading process.env with contents of .env');
dotenv.config();

console.log('Starting server', {
  env: process.env.NODE_ENV,
});

// tslint:disable-next-line:no-var-requires
const { startServer, stopServer } = require('./server');

startServer();
process.on('beforeExit', stopServer);
