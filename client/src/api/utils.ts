import Cookies from 'js-cookie';

export function authFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const extendedHeaders: { [key: string]: any } = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = Cookies.get('token');
  if (!token) {
    throw new Error('missing auth token');
  }

  extendedHeaders.Authorization = `Bearer ${token}`;

  options.headers = extendedHeaders;

  return fetch(url, options).then(res => res.json());
}
