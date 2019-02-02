import { startServer } from '../../src/server';

export = () => {
  const dotenv = require('dotenv');
  dotenv.load();

  startServer();
};
