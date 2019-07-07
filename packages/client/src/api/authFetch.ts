import Cookies from 'js-cookie';
import * as qs from 'query-string';

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

export namespace ApiResponse2 {
  export type Success<T> = {
    data: T;
    status: number;
  };

  export type Error = {
    error: string;
    error_details?: string;
    status: number;
  };
}

export type ApiResponse2<T> = ApiResponse2.Success<T> | ApiResponse2.Error;

export function authFetch2<T>(
  url: string,
  options: RequestInit & { query?: Record<string, unknown> } = {}
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

  if (options.query) {
    // tslint:disable-next-line:no-parameter-reassignment
    url += qs.stringify(options.query);
  }

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
