import { exec } from './exec';

try {
  exec(`
    rm -rf __deploy
  `);
} catch (err) {
  console.warn(err);
}

exec(`
  mkdir __deploy
  cp -r dist/server __deploy/server
  cp -r dist/common __deploy/common
  scp -r __deploy/* anumuser@rno.ii.uni.wroc.pl:~/app
`);

exec(`
  rm -rf __deploy
`);

exec(
  `
  ssh anumuser@rno.ii.uni.wroc.pl \
  "pm2 stop lagrange-server; \
  pm2 flush; \
  cd ~/app/common && yarn; \
  cd ~/app/server && yarn; \
  cd ~; \
  pm2 start ecosystem.config.js
`
);
