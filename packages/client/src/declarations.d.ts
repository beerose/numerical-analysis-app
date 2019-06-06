declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    PUBLIC_URL: string;
    IP: string;
  }
}

declare module '@reach/visually-hidden' {
  const VisuallyHidden: React.SFC;

  export default VisuallyHidden;
}

declare module '*.svg' {
  const uri: string;
  export default uri;
}
