'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./src/server.js');

const MONGOOSE_URI = process.env.MONGOOSE_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect(MONGOOSE_URI, options);


server.start(process.env.PORT || 3000);