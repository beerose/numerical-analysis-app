import { exec } from './exec';

exec(`
  yarn build-client --public-url ./
  
  ssh anumuser@rno.ii.uni.wroc.pl rm -rf ~/www-lagrange/*
  scp -r dist/client/* anumuser@rno.ii.uni.wroc.pl:~/www-lagrange
`);
