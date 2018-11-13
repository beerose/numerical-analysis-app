declare var process: NodeJS.Process;

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'morgan-body';

declare module 'mail-service';
declare module 'campaign';
declare module 'campaign-terminal';
