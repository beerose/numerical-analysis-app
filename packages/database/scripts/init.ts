import { execSync } from 'child_process';

// tslint:disable-next-line:no-var-requires
const dotenv = require('dotenv');
dotenv.config();

execSync(`
  docker run -d -p 3306:3306 --name numerical-mysql \
  -v $(PWD)/sql-scripts/:/docker-entrypoint-initdb.d/ \
  -e MYSQL_ROOT_PASSWORD=${process.env.MYSQL_ROOT_PASSWORD} -e MYSQL_DATABASE=${
  process.env.DB_NAME
} mysql
`);
