export = () => {
  const dotenv = require('dotenv');
  dotenv.load();

  process.env.NODE_ENV = 'test';

  const { startServer } = require('../../src/server');
  startServer();
};
