let urls;

if (process.env.NODE_ENV !== 'production') {
  const host = process.env.IP || 'localhost';
  urls = {
    // tslint:disable:no-http-string
    SERVER_URL: `http://${host}:8080`,
    // tslint:enable:no-http-string
  };
} else {
  urls = {};
}

export const SERVER_URL = urls.SERVER_URL;
