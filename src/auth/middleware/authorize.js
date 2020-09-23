'use strict';
const User = require('../models/users-model');

module.exports = (action) => {
  return async (req, res, next) => {
    try {
      let role = req.user.role;
      if (await User.can(role, action)) {
        next();
      } else {
        next('Forbidden');
      }
    } catch (e) {
      next(e);
    }

  };
};