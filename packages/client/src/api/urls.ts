let urls;

if (process.env.NODE_ENV !== 'production') {
  const serverUrl = process.env.SERVER_URL || 'http://localhost:8082';
  urls = {
    // tslint:disable:no-http-string
    SERVER_URL: serverUrl,
    // tslint:enable:no-http-string
  };
} else {
  urls = {
    SERVER_URL: process.env.SERVER_URL!,
  };
}

export const SERVER_URL = urls.SERVER_URL;

console.assert(SERVER_URL, 'SERVER_URL must be defined in process.env');
