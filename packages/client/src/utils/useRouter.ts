import { useContext } from 'react';
import { __RouterContext, RouteComponentProps } from 'react-router';

declare module 'react-router' {
  export const __RouterContext: React.Context<RouteComponentProps<any>>;
}

export default function useRouter<T = any>(): RouteComponentProps<T> {
  return useContext(__RouterContext);
}
