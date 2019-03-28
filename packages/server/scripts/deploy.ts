import exec from 'executive';

exec.sync(
  ` 
  scp -rv ../../dist/* anumuser@rno.ii.uni.wroc.pl:~/app
  ssh anumuser@rno.ii.uni.wroc.pl "cd ~/app/server; yarn; pm2 start ./index.js --name lagrange-server"
`,
  {
    syncThrows: true,
  }
);
