export = () => {
  const dotenv = require('dotenv');
  dotenv.load();

  const { startServer } = require('../../src/server');
  startServer();
};
