import Cookies from 'js-cookie';
import { isPlainObject as lodashIsPlainObject } from 'lodash';
import * as qss from 'qss';
import { Primitive } from 'utility-types';

import { ApiResponse } from '../../../../dist/common';

type Json = Primitive | JsonArray | JsonObject;
interface JsonArray extends Array<Json> {}
interface JsonObject extends Record<string | number, Json> {}

type PlainObject = JsonObject;
const isPlainObject = lodashIsPlainObject as (x: unknown) => x is PlainObject;

/**
 * @deprecated
 */
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

  export namespace Error {
    type ErrorLike = { message: string };

    /**
     * Turn api errors and errorlike objects (boxed message) to string
     */
    export function toString(err: Error | ErrorLike) {
      if ('message' in err) {
        return err.message;
      }

      if (process.env.NODE_ENV === 'development') {
        return JSON.stringify(err, null, 2);
      }

      return `${err.status} ${err.error}`;
    }
  }

  export type Error = {
    /**
     * Error type and message.
     */
    error: string;
    /**
     * Additional error details for developer eyes only.  \
     * **Do not display this in the user interface.**
     */
    error_details?: string;
    /**
     * Error HTTP status code
     */
    status: number;
  };

  export function isError(x: unknown): x is Error {
    return (
      typeof x === 'object' &&
      x !== null &&
      typeof (x as Record<string, any>).status === 'number' &&
      typeof (x as Record<string, any>).error === 'string'
    );
  }
}

export type ApiResponse2<T> = ApiResponse2.Success<T> | ApiResponse2.Error;

interface AuthFetch2Options extends Omit<RequestInit, 'body'> {
  query?: Record<string, unknown>;
  body?: RequestInit['body'] | PlainObject;
}

export function authFetch2<T>(
  url: string,
  options: AuthFetch2Options = {}
): Promise<ApiResponse2<T>> {
  let token = '';
  if (!(options.headers && 'Authorization' in options.headers)) {
    token = Cookies.get('token') || token;
    if (!token) {
      throw new Error('missing auth token');
    }
  }

  const opts: RequestInit = {};
  opts.headers = {
    Accept: 'application/json, text/plain, */*',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (options.query) {
    // tslint:disable-next-line:no-parameter-reassignment
    url += '?' + qss.encode(options.query);
  }

  opts.body = isPlainObject(options.body)
    ? JSON.stringify(options.body)
    : options.body;

  return fetch(url, opts).then(async res => {
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
