const supergoose = require('@code-fellows/supergoose');
const {server} = require('../src/server');
const agent = supergoose(server);
const base64 = require('base-64');
const jwt = require('jsonwebtoken');


describe('Extra route auth server', () => {
  const signinObj = {
    username: 'Ashjan',
    password: 'blah',
  };

  
  it('can successfully check if the user is valid', async () => {
    const signupResponse = await agent.post('/signup').send(signinObj);
    const autHeader = base64.encode(
      `${signinObj.username}:${signinObj.password}`,
    );
  
    const signinResponse = await agent
      .post('/signin')
      .set('authorization', `Basic ${autHeader}`);

    const bearerHeader = await jwt.sign({ username: 'Ashjan' }, 'ash');

    const secretResponse = await agent.get('/secret').set('authorization', `Bearer ${bearerHeader}`);
    expect(signupResponse.statusCode).toBe(200);
    expect(signinResponse.statusCode).toBe(200);
    expect(secretResponse.statusCode).toBe(200);
    expect(!!signupResponse.text).toBeTruthy();
  });

  it('Should not return the user if it is not valid', async () => {
    const bearerHeader = await jwt.sign({ username: 'Ash' }, 'ash');
    const secretResponse = await agent.get('/secret').set('authorization', `Bearer ${bearerHeader}`);
    expect(secretResponse.statusCode).toBe(500);
    expect(secretResponse.text).toBeTruthy();

  });
});