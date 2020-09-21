'use strict';

const base64 = require('base-64');
const User = require('../models/users-model');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    const basic = req.headers.authorization.split(' ').pop();
    const [user, pass] = base64.decode(basic).split(':');
    User
      .authenticate(user, pass)
      .then(valid => {
        req.user = valid;
        return valid.generateToken();
      }).then(token => {
        req.token = token;
        next();
      })
      .catch((err) => next(err));
  }
};