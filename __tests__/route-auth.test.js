const supergoose = require('@code-fellows/supergoose');
const {server} = require('../src/server');
const agent = supergoose(server);
const base64 = require('base-64');
const jwt = require('jsonwebtoken');


describe('Extra route auth server', () => {
  const signinObj = {
    username: 'Ashjan',
    password: 'blah',
    role: 'admin',
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

  it('Can successfully check if the user has access to /read', async () => {
    const bearerHeader = await jwt.sign({ username: 'Ashjan' }, 'ash');
    const secretResponse = await agent.get('/read').set('authorization', `Bearer ${bearerHeader}`);
    expect(secretResponse.statusCode).toBe(200);
    expect(secretResponse.text).toBeTruthy();
  });

  it('Can successfully check if the user has access to /add', async () => {
    const bearerHeader = await jwt.sign({ username: 'Ashjan' }, 'ash');
    const secretResponse = await agent.post('/add').set('authorization', `Bearer ${bearerHeader}`);
    expect(secretResponse.statusCode).toBe(200);
    expect(secretResponse.text).toBeTruthy();
  });

  it('Can successfully check if the user has access to /change', async () => {
    const bearerHeader = await jwt.sign({ username: 'Ashjan' }, 'ash');
    const secretResponse = await agent.put('/change').set('authorization', `Bearer ${bearerHeader}`);
    expect(secretResponse.statusCode).toBe(200);
    expect(secretResponse.text).toBeTruthy();
  });

  it('Can successfully check if the user has access to /remove', async () => {
    const bearerHeader = await jwt.sign({ username: 'Ashjan' }, 'ash');
    const secretResponse = await agent.delete('/remove').set('authorization', `Bearer ${bearerHeader}`);
    expect(secretResponse.statusCode).toBe(200);
    expect(secretResponse.text).toBeTruthy();
  });

  it('Should not return the user if it is not valid', async () => {
    const bearerHeader = await jwt.sign({ username: 'Ash' }, 'ash');
    const secretResponse = await agent.get('/secret').set('authorization', `Bearer ${bearerHeader}`);
    expect(secretResponse.statusCode).toBe(500);
    expect(secretResponse.text).toBeTruthy();
  });

});