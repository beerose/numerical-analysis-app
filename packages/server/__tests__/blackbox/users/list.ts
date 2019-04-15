import { fetch } from '../fetch';

describe('get /users', () => {
  it('should respond with users list', () =>
    fetch('/users')
      .expectStatus(200)
      .then(
        res =>
          res
            .text()
            .then(text => expect(text.startsWith('Hello!')).toBeTruthy()),
        fail
      ));
});
