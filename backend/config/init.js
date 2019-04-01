let path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const _ = require('lodash');
dotenv.config();

module.exports = () => {
  let config = {};
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev') {
    let env = {};
    const envConfig = dotenv.parse(fs.readFileSync(path.resolve('./dotenv/.env')))
    const envConfigDev = dotenv.parse(fs.readFileSync(path.resolve('./dotenv/.env.dev')))
    env = _.defaults(envConfigDev, envConfig);
    global.env = env;
    config = require(path.resolve('./config/default'));
  } else {
    global.env = process.env;
    config = require(path.resolve('./config/default'));
  }

  global.config = config;
}

