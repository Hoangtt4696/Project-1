/**
 * @author Tran Dinh Hoang
 */

'use strict';

const path                = require('path');
const helperClass         = require(path.resolve('./helper/class'));
const BaseController      = require(path.resolve('./core/controller/base'));
const UserLoginHr         = require('../business/user-login-hr');
const UserTokenUpdate     = require('../business/user-token-update');
class AuthenticationController extends BaseController {
  constructor(req, res, next) {
    super(req, res, next);
  }

  async authCode() {
    let url;
    try {
      let userLoginHr = new UserLoginHr(this._body.code);
      let userHr = await userLoginHr.authenication();
      if (userLoginHr.error) {
        url = `${global.config.client_login_error_callback_url}?error=${encodeURIComponent(userLoginHr.message.join(', '))}`;
      }
      else {
        let userTokenUpdate = new UserTokenUpdate(userHr);
        let userToken = await userTokenUpdate.updateLogin();
        if (userTokenUpdate.error) {
          url = `${global.config.client_login_error_callback_url}?error=${encodeURIComponent(userTokenUpdate.message.join(', '))}`;
        }
        else {
          // console.log(`[  USER TOKEN   ] ${userToken.token}`);
          url = `${global.config.client_login_callback_url}?token=${userToken.token}&expiredAt=${userToken.expired_at}`;
        }
      }
    }
    catch (err) {
      url = `${global.config.client_login_error_callback_url}?error=${encodeURIComponent('Có lỗi xảy ra vui lòng thử lại, chi tiết lỗi')} : ${encodeURIComponent(err.message)}`;
    }
    this._res.writeHead(302, { 'Location' :  url });
    return this._res.end();
  }

  async getUserInfo() {
    let user_info = this._req.user;
    delete user_info.access_token;
    return this.renderJson(user_info);
  }
}

module.exports = helperClass.exportClassMethod(AuthenticationController, [
  'authCode',
  'getUserInfo'
]);