const supergoose = require('@code-fellows/supergoose');
const {server} = require('../src/server');
const agent = supergoose(server);
const Users = require('../src/auth/models/users-model');
const base64 = require('base-64');
const jwt = require('jsonwebtoken');


describe('basic auth server', () => {
  const signinObj = {
    username: 'Ashjan',
    password: 'blue',
    role: 'admin',
  };

  const signinObj2 = {
    username: 'nour',
    password: 'red',
    role:'user',
  };

  const badObj = {
    notUsername: false,
    password: 1.523,
    someOtherProp: 'lulz',
  };

  it('can allow a new user to sign up', async () => {
    const signupResponse = await agent.post('/signup').send(signinObj);
    expect(signupResponse.statusCode).toBe(200);
    expect(!!signupResponse.text).toBeTruthy();
  });

  it('can prevent users from signing up with an existing username', async () => {
    await agent.post('/signup').send(signinObj);
    await agent.post('/signup').send(signinObj);
    const secondSignupRes = await agent.post('/signup').send(signinObj);
    expect(secondSignupRes.statusCode).toBe(403);
  });

  it('can console error for invalid signup', async () => {
    jest.spyOn(global.console, 'error');
    console.log = jest.fn();
    const signupResponse = await agent.post('/signup').send(badObj);
    expect(console.log).toHaveBeenCalled();
    expect(signupResponse.statusCode).toBe(403);
  });

  it('can allow an existing user to sign in', async () => {
    const autHeader = base64.encode(
      `${signinObj.username}:${signinObj.password}`,
    );

    const signinResponse = await agent
      .post('/signin')
      .set('authorization', `Basic ${autHeader}`);

    expect(signinResponse.statusCode).toBe(200);
    expect(!!signinResponse.text).toBeTruthy();
  });

  it('will return a 500 error for incorrect login credentials', async () => {

    const realBadAuthHeader = base64.encode(
      `testingbobred:wrong-password1234`,
    );

    const signinResponse = await agent
      .post('/signin')
      .set('authorization', `Basic ${realBadAuthHeader}`);

    expect(signinResponse.statusCode).toBe(500);
    expect(signinResponse.body).toEqual({});

    const wrongPasswordHeader = base64.encode(
      `${signinObj.username}:wrong-password1234-again-555`,
    );

    const signinResponse2 = await agent
      .post('/signin')
      .set('authorization', `Basic ${wrongPasswordHeader}`);
    expect(signinResponse2.statusCode).toBe(500);
    expect(signinResponse2.body).toEqual({});
  });

  it('can return all users', async () => {
    await Users.create(signinObj2);

    const autHeader = base64.encode(
      `${signinObj.username}:${signinObj.password}`,
    );

    const getResponse = await agent
      .get('/users')
      .set('authorization', `Basic ${autHeader}`);
    expect(getResponse.statusCode).toEqual(200);
    expect(getResponse.body[0].username).toEqual('Ashjan');
    expect(getResponse.body[1].username).toEqual('nour');
  });

  it('will return a 200 and an array of objects when called get users', async () => {

    const getResponse = await agent.get('/users');
    expect(getResponse.statusCode).toEqual(200);
    expect(getResponse.body).not.toEqual({});
  });

  it('can successfully check if the user is valid for /add route', async () => {
    const autHeader = base64.encode(
      `${signinObj.username}:${signinObj.password}`,
    );
  
    const signinResponse = await agent
      .post('/signin')
      .set('authorization', `Basic ${autHeader}`);

    const bearerHeader = await jwt.sign({ username: 'nour' }, 'ash');

    const secretResponse = await agent.post('/add').set('authorization', `Bearer ${bearerHeader}`);
    expect(signinResponse.statusCode).toBe(200);
    expect(secretResponse.statusCode).toBe(500);
  });

  it('can successfully check if the user is valid for /change route', async () => {
    const bearerHeader = await jwt.sign({ username: 'nour' }, 'ash');
    const secretResponse = await agent.put('/change').set('authorization', `Bearer ${bearerHeader}`);
    expect(secretResponse.statusCode).toBe(500);
  });

  it('can successfully check if the user is valid for /remove route', async () => {
    const bearerHeader = await jwt.sign({ username: 'nour' }, 'ash');
    const secretResponse = await agent.delete('/remove').set('authorization', `Bearer ${bearerHeader}`);
    expect(secretResponse.statusCode).toBe(500);
  });

});