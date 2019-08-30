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
  ssh anumuser@rno.ii.uni.wroc.pl "(rm -rf ~/new-app || true) && mkdir ~/new-app"
  scp -r __deploy/* anumuser@rno.ii.uni.wroc.pl:~/new-app
`);

exec(`
  rm -rf __deploy
`);

exec(
  `
  ssh anumuser@rno.ii.uni.wroc.pl \
  "pm2 stop lagrange-server; \
  rm -rf ~/app || true; \
  mv ~/new-app ~/app; \
  pm2 flush; \
  cd ~/app/common && yarn; \
  cd ~/app/server && yarn; \
  echo "require('./src/index.js')" > index.js; \
  cd ~; \
  pm2 start ecosystem.config.js
`
);
