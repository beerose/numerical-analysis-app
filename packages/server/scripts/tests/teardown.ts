export = () => {
  const { stopServer } = require('../../src/server');
  stopServer();
  const { connection } = require('../../src/store/connection');
  connection.end();
};
