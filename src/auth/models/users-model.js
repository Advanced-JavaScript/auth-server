'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET || 'ash';
const schema = require('./users-schema');

/**
 * @param class Users with the same structure as the schema
 * @method create saves a new user
 * @method generateToken creates a new token for a user
 * @method authenticate checks if the user is valid
 * @method list returns all Users from the db
 */

class Users {
  constructor(schema) {
    this.schema = schema;
  }

  async create(user) {
    let db = await this.schema.find({ username: user.username });
    if (db.length === 0) {
      let newUser = new this.schema(user);
      return await newUser.save();
    }
    return Promise.reject('User already exists');
  }

  async generateToken(user) {
    const token = await jwt.sign({ username: user.username }, SECRET);
    return token;
  }

  async authenticate(username, password) {
    let user = await this.schema.find({ username: username });
    try {
      const valid = await bcrypt.compare(password, user[0].password);
      return valid ? user : Promise.reject('Password not correct');
    } catch (e) {
      console.log(e.message);
    }
  }

  async list() {
    let allUsers = await this.schema.find({});
    return allUsers;
  }

}

module.exports = new Users(schema);