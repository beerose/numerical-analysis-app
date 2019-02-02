import mysql, { Connection } from 'mysql';

const dbConfig = {
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
};

// Watch out! Type unsafe! We expect `connectToDb` will be called before accessing connection.
let con: Connection = {} as Connection;
export const connection = new Proxy(con, {
  get: (target, prop) => target[prop as keyof Connection],
});

export const connectToDb = () => {
  console.log('Connecting to database...');
  con = mysql.createConnection(dbConfig);
  con.connect(err => {
    if (err) {
      console.warn('Error occurred when connecting to database:\n', err);
      setTimeout(connectToDb, 2000);
    }
  });
  con.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Connection to database lost!');
      connectToDb();
    } else {
      throw err;
    }
  });
};

export const DUPLICATE_ENTRY_ERROR = 'ER_DUP_ENTRY';
