import mysql, { createConnection } from 'mysql';

const dbConfig = {
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
};

if (!dbConfig.user) {
  throw new Error('DB_USER is not defined');
}

enum ConnectionStatus {
  Off = 'Off',
  On = 'On', // Connecting or Connected
  ShuttingDown = 'ShuttingDown',
}

type LocalConnectionState = {
  // We'll abort reconnecting after few consecutive failures
  readonly retriesLeft: number;
  readonly status: ConnectionStatus;
};
const MAX_RETRIES = 5;
let conState: LocalConnectionState = {
  retriesLeft: MAX_RETRIES,
  status: ConnectionStatus.Off,
};
function setConState<K extends keyof LocalConnectionState>(
  diff: Pick<LocalConnectionState, K>
) {
  conState = {
    ...conState,
    ...diff,
  };

  if (
    conState.status !== ConnectionStatus.ShuttingDown &&
    conState.retriesLeft === 0
  ) {
    throw new Error(
      `Can't connect to the database. Failing after ${MAX_RETRIES} retries`
    );
  }
}

// Watch out! We expect `connectToDb` will be called before accessing connection.
let connection = mysql.createConnection(dbConfig);
export { connection };

export const connectToDb = () => {
  console.log(`
    Connecting to database...
    Local conState.status is ${conState.status}.
    connection.state is ${connection.state}.
  `);
  if (
    connection.state === 'disconnected' ||
    connection.state == 'protocol_error'
  ) {
    connection.connect(err => {
      connection = createConnection(dbConfig);
      if (err) {
        console.warn(
          'Error occurred when connecting to database:\n',
          err,
          conState
        );
        setConState({ retriesLeft: conState.retriesLeft - 1 });
        setTimeout(connectToDb, 2000);
      } else {
        console.log('Connected to database!');
        setConState({ status: ConnectionStatus.On, retriesLeft: MAX_RETRIES });
      }
    });

    connection.on('error', err => {
      if (conState.status === ConnectionStatus.On) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          setConState({
            retriesLeft: conState.retriesLeft - 1,
            status: ConnectionStatus.Off,
          });

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
  setConState({
    retriesLeft: 0,
    status: ConnectionStatus.ShuttingDown,
  });
  connection.pause();
};
