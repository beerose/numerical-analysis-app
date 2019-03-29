import Cookies from 'js-cookie';
import { ApiResponse } from '../../../../dist/common';

export function authFetch<T = ApiResponse>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = Cookies.get('token');
  if (!token) {
    throw new Error('missing auth token');
  }

  options.headers = {
    Accept: 'application/json, text/plain, */*',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(url, options).then(res => res.json());
}
