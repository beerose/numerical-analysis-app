import dotenv from 'dotenv';
process.env.NODE_ENV = 'test';
dotenv.load();

export = () => {
  const { startServer } = require('../../src/server');
  startServer();
};
