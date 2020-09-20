'use strict';

const { server } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe('Internal server error', () => {

  it('return 500 ', () => {
    const obj = { name: 'blah', description: 'blah blah' };
    return mockRequest
      .post('/signin')
      .send(obj)
      .then((results) => {
        expect(results.status).toBe(500);
      });
  });
});