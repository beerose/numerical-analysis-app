export = () => {
  const { stopServer } = require('../../src/server');
  stopServer();
  process.exit();
};
