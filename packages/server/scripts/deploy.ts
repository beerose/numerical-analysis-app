import exec from 'executive';

exec.sync(
  ` 
  scp -rv ../../dist/* anumuser@rno.ii.uni.wroc.pl:~/app
  ssh anumuser@rno.ii.uni.wroc.pl
`,
  {
    syncThrows: true,
  }
);
