import { makeFetch } from 'supertest-fetch';

import { app } from '../../src/server';

const fetch = makeFetch(app);

describe('GET /', () => {
  it('responds nicely', () => {
    fetch('/')
      .expectStatus(200)
      .then(res => res.text(), console.error)
      .then(t => console.log({ t }));
  });
});
