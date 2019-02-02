import { makeFetch } from 'supertest-fetch';

import { app } from '../../src/server';

const fetch = makeFetch(app);

describe('get /', () => {
  it('responds nicely', () =>
    fetch('/')
      .expect(200, 'Hello! 👋')
      .end());
});
