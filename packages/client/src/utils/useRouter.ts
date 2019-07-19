import { useContext } from 'react';
import { __RouterContext, RouteComponentProps } from 'react-router';

export default function useRouter<T = any>(): RouteComponentProps<T> {
  return useContext(__RouterContext as React.Context<RouteComponentProps<any>>);
}
