import mysql from 'mysql';

const dbConfig = {
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
};

// Watch out! Type unsafe! We expect `connectToDb` will be called before accessing connection.
export const connection = mysql.createConnection(dbConfig);

export const connectToDb = () => {
  console.log('Connecting to database...');
  connection.connect(err => {
    if (err) {
      console.warn('Error occurred when connecting to database:\n', err);
      setTimeout(connectToDb, 2000);
    }
  });
  connection.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Connection to database lost!');
      connectToDb();
    } else {
      throw err;
    }
  });
};

export const DUPLICATE_ENTRY_ERROR = 'ER_DUP_ENTRY';
