'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const notFound = require('./middleware/404');
const internalServerError = require('./middleware/500');
const router = require('./auth/router');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use('/', router);

app.use('*',notFound);
app.use(internalServerError);

module.exports = {
  server: app,
  start: port => {
    app.listen(port, () => console.log('Magic happens on:', port));
  },
};