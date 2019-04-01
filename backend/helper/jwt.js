/**
 * @module helperJwt
 */

const jwt = require('jsonwebtoken');
const config = global.config;

exports.verifyJwtToken = (token) => {
  let result = {};
  if (token != '') {
    try {
      result = jwt.verify(token, config.hash_token);
    } 
    catch (e) {
      console.log('Verify Token Fail : ' + token);
    }
  }
  return result;
};

exports.genJwtToken = (data, hour_exp) => {
  let objToken = {data};
  hour_exp = hour_exp ? hour_exp : config.expired_token;
  objToken.exp = Math.floor(Date.now() / 1000) + (hour_exp * 60);
  let token = jwt.sign(objToken, config.hash_token);
  return [token, objToken.exp];
};