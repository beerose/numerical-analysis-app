declare var process: {
  env: {
    NODE_ENV: string;
    PUBLIC_URL: string;
    IP: string;
  };
};

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'morgan-body';
