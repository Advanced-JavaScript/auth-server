'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const users = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String },
  fullname: { type: String },
  role: { type: String, default: 'user', enum: ['admin', 'editor', 'writer', 'user'] },
});

users.pre('save', async function (next) {
  try{
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch(e){
    throw Error('Did not save');
  }
    
});
 
module.exports = mongoose.model('users', users);