// tslint:disable:no-var-requires

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.load();
}

require('./store/connection');

require('./server');
