'use strict';

const express = require('express');
const bearerAuth = require('./middleware/bearer');
const permissions = require('./middleware/authorize');

const secureRouter = express.Router();

secureRouter.get('/secret', bearerAuth, secret);
secureRouter.get('/read', bearerAuth, permissions('read'), read);
secureRouter.post('/add', bearerAuth, permissions('create'), add);
secureRouter.put('/change', bearerAuth, permissions('update'), change);
secureRouter.delete('/remove', bearerAuth, permissions('delete'), remove);

/**
 * @route GET/checks if the user is valid to enter specific routes
 * @param {User}  - the new user
 * @returns {} 200 - a token has been checked and a user is returned
 * @returns {Error} 403 - unexpected error
 */

async function secret(req, res, next) {
  try {
    res.status(200).json({ bearer: 'Valid User', user: req.user });
  } catch (e) {
    res.status(403).json('Invalid credentials');
  }
}

async function read(req, res, next) {
  try {
    res.status(200).json({ message: 'Route /read worked', user: req.user });
  } catch (e) {
    res.status(403).json('Forbidden: Invalid credentials');
  }
}

async function add(req, res, next) {
  try {
    res.status(200).json({ message: 'Route /add worked', user: req.user });
  } catch (e) {
    res.status(403).json('Forbidden: Invalid credentials');
  }
}

async function change(req, res, next) {
  try {
    res.status(200).json({ message: 'Route /change worked', user: req.user });
  } catch (e) {
    res.status(403).json('Forbidden: Invalid credentials');
  }
}

async function remove(req, res, next) {
  try {
    res.status(200).json({ message: 'Route /remove worked', user: req.user });
  } catch (e) {
    res.status(403).json('Forbidden: Invalid credentials');
  }
}



module.exports = secureRouter;


