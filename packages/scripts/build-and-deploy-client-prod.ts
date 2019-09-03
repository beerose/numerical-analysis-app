import { exec } from './exec';

exec(
  `
  mv .env.production .env.production.backup
  mv .env.production-baremetal .env.production
`,
  {
    dir: 'packages/client',
  }
);

exec(`
  rm -rf dist/client/
  yarn build-client --public-url /lagrange
`);

exec(
  `
  mv .env.production .env.production-baremetal
  mv .env.production.backup .env.production
`,
  {
    dir: 'packages/client',
  }
);

exec(`
  ssh anumuser@rno.ii.uni.wroc.pl rm -rf y
  
  scp -rp dist/client/* dist/client/.htaccess anumuser@rno.ii.uni.wroc.pl:~/www-lagrange
`);
