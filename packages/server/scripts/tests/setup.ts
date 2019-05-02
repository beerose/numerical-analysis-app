import dotenv from 'dotenv';
process.env.NODE_ENV = 'test';
dotenv.load();

import { connection } from '../../src/store/connection';

export = () => {
  const { startServer } = require('../../src/server');
  startServer();

  connection.query(
    {
      sql: `SELECT SCHEMA_NAME
            FROM INFORMATION_SCHEMA.SCHEMATA
            WHERE SCHEMA_NAME = ?`,
      values: [process.env.TEST_DB_NAME],
    },
    (err, res) => {
      if (err) {
        console.error(err);
        process.exit();
      }
      if (!res.length) {
        // cretate
      }

      console.log({ res });
    }
  );
};
