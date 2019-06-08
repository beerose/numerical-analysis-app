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

/**
 * New API client proposal:
 */

type ApiResponse2<T> =
  | {
      data: T;
      status: number;
    }
  | {
      error: string;
      error_details?: string;
      status: number;
    };

export function authFetch2<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse2<T>> {
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

  return fetch(url, options).then(async res => {
    const json = await res.json();
    return json.error
      ? {
          error: json.error,
          error_details: json.error_details,
          status: res.status,
        }
      : {
          data: json,
          status: res.status,
        };
  });
}
