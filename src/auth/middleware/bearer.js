'use strict';
const User = require('../models/users-model');

module.exports = async(req, res, next) => {
  console.log('user inside token',req.user);
  req.token=await User.generateToken(req.user);
  let user =await User.update(req.user._id,{token:req.token});
  console.log(user);
  next();
};