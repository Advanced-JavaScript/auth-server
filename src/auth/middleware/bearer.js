'use strict';
const User = require('../models/users-model');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) {
    return next('Invalid Login, No Headers !!');
  }
  let bearer = req.headers.authorization.split(' ');

  if (bearer[0] == 'Bearer') {
    const token = bearer[1];
    User.authenticateToken(token).then(validUser => {
      req.user = validUser.user;
      next();
    }).catch(() => next('Invalid Token!'));
  } else {
    return next('Invalid Bearer!!');
  }

};


