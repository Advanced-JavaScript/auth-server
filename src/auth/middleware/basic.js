'use strict';

const base64 = require('base-64');
const users = require('../models/users-model');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    const basic = req.headers.authorization.split(' ').pop();
    const [user, pass] = base64.decode(basic).split(':');
    users
      .authenticate(user, pass)
      .then(valid => {
        return users.generateToken(valid);
      }).then(token => {
        req.token = token;
        req.user=user;
        next();
      })
      .catch((err) => next(err));
  }
};