'use strict';

require('dotenv').config();
const superagent = require('superagent');
const User = require('../models/users-model');


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;
const TOKEN_SERVER = process.env.TOKEN_SERVER;
const REMOTE_API = process.env.REMOTE_API;


module.exports = async (req, res, next) => {

  try {
    const code = req.query.code;
    const remoteToken = await exchangeCodeForToken(code);
    const remoteUser = await getRemoteUser(remoteToken);
  
    let info = {
      username:remoteUser.name,
      password: 'P@ssw0rd',
    };
      
    const user = new User (await getUser(info));
    req.user = user;
    req.token = await user.generateToken();
    next();
  } catch (err) {
    next(err.message);
  }
};

async function exchangeCodeForToken(code) {
  const tokenResponse = await superagent.post(TOKEN_SERVER).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
  });
  const access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUser(token) {
  const userResponse = await superagent
    .get(REMOTE_API)
    .set('Authorization', `token ${token}`)
    .set('user-agent', 'express-app');
  
  const user = userResponse.body;
  return user;
}

async function getUser(remoteUser) {
  let checked = await User.findOne({username : remoteUser.username});
  if(checked){
    return checked;
  }
  checked = new User(remoteUser);
  checked.save();
  return checked;
}
