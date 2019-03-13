import { fetch } from './fetch';

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
