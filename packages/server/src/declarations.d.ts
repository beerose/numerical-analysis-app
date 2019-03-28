declare namespace NodeJS {
  interface Process {
    JWT_SECRET: string;
  }
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'morgan-body';

declare module 'mail-service';
declare module 'campaign';
declare module 'campaign-terminal';

declare module 'xxhash';

type Blob = unknown;
