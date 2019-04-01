/**
 * @author Nguyen Hong Quan
 * @edit Tran Dinh Hoang
 * @description move from haraoes app
 */

'use strict';

const _              = require('lodash');
const path           = require('path');
const config         = global.config;
const jwt            = require('jsonwebtoken');
const SettingQuery   = require(path.resolve('./modules/admin/setting/model/setting'));
const UserTokenQuery = require(path.resolve('./modules/admin/user/model/user-token'));
/**
 * Check jwt token, if valid, assign user which access token to request
 */
module.exports = function (req, res, next) {
  if (getCheckUrl(req)) {
    let token = _.get(req, 'headers.accesstoken', ''); 
    if (token !== '') {
      var [user, exp] = formatJwt(token);
      var [pass, message] = checkData(user, exp);
      if (pass) {
        UserTokenQuery.selectOne({
          orgid   : user.orgid,
          user_id : user.id,
        }).then(async function (objToken) {
          if (_.isObjectLike(objToken)) {
            objToken = _.get(objToken, '_doc', objToken);
            if (objToken.status === UserTokenQuery.model.STATUS_ACTIVE && token === objToken.token) {
              req.user = user;
              next();
            } else {
              let objLog = {
                db_token: objToken.token,
                user_token: token,
                status: objToken.status,
                checkStatus: objToken.status === UserTokenQuery.model.STATUS_ACTIVE,
                checkToken: token === objToken.token
              }
              console.log('token change', JSON.stringify(objLog), __dirname);
              message.push('Thông tin tài khoản đã thay đổi')
            }
          } else {
            message.push('Mã truy cập không hợp lệ');
          }

          if (message.length) {
            return res.status(401).send({
              error  : true,
              message: message
            });
          }
        });
      } else {
        return res.status(401).send({
          error  : true,
          message: message
        });
      }
    } else {
      return res.status(401).send({
        error  : true,
        message: ['Token is reqiured']
      });
    }
  } else {
    next();
  }
};

function getCheckUrl(req) {
  let pass = false;
  let url = _.get(req, 'originalUrl', '');
  if (url !== '') {
    url = url.replace('/' + config.appslugadmin + '/', '');
  }
  let allowUrls = ['api/authentication/hr', 'api/auth/signin', '/webhooks/*'];
  let isAllow = allowUrls.findIndex(allow_url => url.search(allow_url) >= 0) >= 0;
  if (url.indexOf('api/') > -1 && !isAllow) {
    pass = true;
  }

  if (req.method === 'OPTIONS') {
    pass = false;
  }
  return pass;
}

function checkData(user, exp) {
  let pass = false;
  let message = [];

  var date = new Date();
  var timestamp = date.getTime();
  if (user) {
    /* *
    * neu time be hon 0 token khong bao gio het han
     */
    if (exp < 0 || exp <= timestamp) {
      pass = true;
    } else {
      message.push('Mã truy cập đã hết hạn')
    }
  } else {
    message.push('Mã truy cập không hợp lệ');
  }

  return [pass, message];
}

function formatJwt(token) {
  let obj = verifyJwtToken(token);
  let user = _.get(obj, 'data', {});
  let exp = _.get(obj, 'exp', 0);
  return [user, exp];
}

function verifyJwtToken(token) {
  let result = {};
  if (token !== '') {
    try {
      result = jwt.verify(token, config.hash_token);
    } 
    catch (e) {
      console.log('Verify Token Fail : ' + token);
    }
  }
  return result;
}
