let urls;

if (process.env.NODE_ENV !== 'production') {
  const host = process.env.IP || 'localhost';
  urls = {
    // tslint:disable:no-http-string
    SERVER_URL: `http://${host}:8082`,
    // tslint:enable:no-http-string
  };
} else {
  urls = {
    SERVER_URL: process.env.SERVER_URL!,
  };
}

export const SERVER_URL = urls.SERVER_URL;

console.assert(SERVER_URL, 'SERVER_URL must be defined in process.env');
