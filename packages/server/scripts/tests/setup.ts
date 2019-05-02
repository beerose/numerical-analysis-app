process.env.NODE_ENV = 'test';

import dotenv from 'dotenv';
dotenv.load();

import { connection } from '../../src/store/connection';

export = async () => {
  const { startServer } = require('../../src/server');
  startServer();

  // Creating user in database
  // TO DO: create users with different roles
  connection.query(
    {
      sql: `
    INSERT IGNORE INTO users(user_name, email, user_role)
    VALUES (?, ?, ?)`,
      values: ['Test Admin User', 'admin@test.com', 'admin'],
    },
    err => {
      if (err) {
        console.error(`Failed to create test user: ${err}`);
        process.exit();
      }
    }
  );
};
