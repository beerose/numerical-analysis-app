// tslint:disable:no-var-requires
process.on('SIGINT', () => {
  console.log('Bye bye!');
  process.exit();
});

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.load();
}

require('./store/connection');

require('./server');
