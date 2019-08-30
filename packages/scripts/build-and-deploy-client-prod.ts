import { exec } from './exec';

exec(`
  rm -rf dist/client/
  yarn build-client --public-url /lagrange --no-minify
`);

exec(`
  ssh anumuser@rno.ii.uni.wroc.pl rm -rf ~/www-lagrange/*
  scp -rp dist/client/* dist/client/.htaccess anumuser@rno.ii.uni.wroc.pl:~/www-lagrange
`);
