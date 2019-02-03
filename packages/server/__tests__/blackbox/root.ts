import { makeFetch } from 'supertest-fetch';

import { app } from '../../src/server';

const fetch = makeFetch(app);

describe('get /', () => {
  it('responds nicely', () =>
    fetch('/')
      .expectStatus(200)
      .then(
        res =>
          res
            .text()
            .then(text => expect(text.startsWith('Hello!')).toBeTruthy()),
        fail
      ));
});
