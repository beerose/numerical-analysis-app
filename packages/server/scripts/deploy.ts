import exec from 'executive';

exec.sync('rm ./_prod');

exec.sync(
  `
  mkdir _prod
  cp ../../dist/common _prod
  cp ../../dist/server _prod
  echo 'Not implemented yet!'
`,
  {
    syncThrows: true,
  }
);
