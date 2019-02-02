import mysql from 'mysql';

const dbConfig = {
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
};

// Watch out! Type unsafe! We expect `connectToDb` will be called before accessing connection.
export const connection = mysql.createConnection(dbConfig);

enum ConState {
  Disconnected = 'Disconnected',
  Connected = 'Connected',
  ShuttingDown = 'ShuttingDown',
}

let state: ConState = ConState.Disconnected;

export const connectToDb = () => {
  console.log(`
    Connecting to database...
    Local ConState state is ${state}.
    connection.state is ${connection.state}.
  `);
  if (connection.state === 'disconnected') {
    connection.connect(err => {
      state = ConState.Connected;
      if (err) {
        console.warn('Error occurred when connecting to database:\n', err);
        setTimeout(connectToDb, 2000);
      }
    });

    connection.on('error', err => {
      if (state === ConState.Connected) {
        state = ConState.Disconnected;
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.log('Connection to database lost!');
          connectToDb();
        } else {
          throw err;
        }
      }
    });
  }
};

export const disconnectFromDb = () => {
  state = ConState.ShuttingDown;
  connection.pause();
};

export const DUPLICATE_ENTRY_ERROR = 'ER_DUP_ENTRY';
