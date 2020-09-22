'use strict';

const express = require('express');
const bearerMiddleware = require('./middleware/bearer');

const extraRouter = express.Router();

extraRouter.get('/secret', bearerMiddleware, secret );

/**
 * @route GET/checks if the user is valid to enter specific routes
 * @param {User}  - the new user
 * @returns {} 200 - a token has been checked and a user is returned
 * @returns {Error} 403 - unexpected error
 */

async function secret(req, res, next) {
  try {
    res.status(200).json({ bearer:'Valid User',user:req.user });
  } catch (e) { res.status(403).json('Invalid credentials');
  }
}


module.exports = extraRouter;


