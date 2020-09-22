'use strict';

const express = require('express');
const basicAuth = require('./middleware/basic');
const User = require('./models/users-model');
const oauth = require('./middleware/oauth');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', basicAuth, signin);
router.get('/Users', getUsers);
router.get('/oauth', oauth, authorize);

/**
 * @route POST /signup creates an individual user object and adds it to the Users database
 * @param {user_request} user.body.required - the new user
 * @returns {token} 200 - a token generated by a generateToken method
 * @returns {Error} 500 - unexpected error
 */

async function signup(req, res, next) {
  const oldUser = await User.findOne({ username: req.body.username });
  if (oldUser) {
    res.status(403).send('User already exist');
  } else {
    let user = new User(req.body);
    user
      .save()
      .then(async (user) => {
        const token = await user.generateToken();
        req.user = user;
        res.set('token', token);
        res.cookie('auth', token);
        res.status(200).json({ token, user });
      })
      .catch(err => {
        console.log('Something went wrong!');
        res.status(403).send(err.message);
      });
  }
}

/**
 * @route POST /signin to the server and returns a token
 * @returns {token} 200 - a token generated by a generateToken method
 * @returns {Error} 500 - unexpected error
 */

function signin(req, res, next) {
  try {
    res.json({ token: req.token, user: req.user });
  } catch (e) { res.status(403).json('Invalid credentials'); }
}

/**
 * @route GET /Users
 * @returns {Users} 200 - An object containing all Users
 * @returns {Error} 403 - invalid login
 * @returns {Error} 500 - unexpected error
 */

async function getUsers(req, res, next) {
  let all = await User.list();
  res.status(200).json(all);
}


async function authorize(req, res) {
  try {
    res.status(200).send(req.token);
  } catch (e) { res.status(403).json('Invalid credentials');
  }
  
}
module.exports = router;