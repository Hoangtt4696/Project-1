/**
 * @author Nguyen Hong Quan
 * @edit Tran Dinh Hoang
 * @description move from haraoes
 */

'use strict';

const path           = require('path');
const config         = global.config;
const _              = require('lodash');
const OAuth2         = require('oauth').OAuth2;
const axios          = require('axios');
const callAPI        = require(path.resolve('./helper/call-api'));
const BaseBusiness   = require(path.resolve('./core/business/base'));
const SettingQuery   = require(path.resolve('./modules/admin/setting/model/setting'));

module.exports = class UserLoginHr extends BaseBusiness {
  constructor(code) {
    super();
    this.code            = code;
    this.access_token    = '';
    this.refresh_token   = '';
    this.response_params = {};
    this.user_hr         = {};
  }

  /**
   * Use hr code to get token (access, refresh) and user info
   * @return user info
   */
  async authenication() {
    try {
      if (!this.code) {
        throw new Error('Code not found in request')
      }
      [this.access_token, this.refresh_token, this.response_params] = await this._getHrToken();
      this.user_hr = await this._getUserHr();
      this.user_hr.user_info = await this._getUserHRFromAccessToken();
      this.user_hr.employee_info = await this._getEmployeeInfo(this.user_hr.id);
      if (this.user_hr.orgid !== config.hraccount_login.orgId) {
        throw new Error('Tài khoản nằm ngoài tổ chức');
      }
      await this._updateHrToken();
      console.dir(this.user_hr);
      return this.user_hr;
    } catch (err) {
      console.dir(this.user_hr);
      this._setError(err);
    }
  }

  async _updateHrToken() {
    let updated_setting = await SettingQuery.updated(
      { 
        'haravan.orgid'         : this.user_hr.orgid,
        'haravan.user_id'       : this.user_hr.id,
        'haravan.access_token'  : this.access_token,
        'haravan.refresh_token' : this.refresh_token,
        'haravan.token_type'    : this.response_params.token_type,
        'haravan.expires_in'    : this.response_params.expires_in,  
        'haravan.get_token_at'  : new Date(),
      },
      { 
        'haravan.orgid'         : this.user_hr.orgid,
        'haravan.user_id'       : this.user_hr.id,
      },
      null, null, true
    );

    return updated_setting;
  }
  
  /**
   * Use code to get Hr token info
   * @return {array} [accessToken, refreshToken, params]
   */
  async _getHrToken() {
    let code = this.code;
    let params = {};
    params.grant_type = config.hraccount_login.grant_type;
    params.redirect_uri = config.hraccount_login.hr_call_back_url;

    let _oauth2 = new OAuth2(
      config.hraccount_login.clientID,
      config.hraccount_login.clientSecret,
      '',
      config.hraccount_login.url_authorize,
      config.hraccount_login.url_connect_token,
      ''
    );

    return new Promise(function (resolve, reject) {
      _oauth2.getOAuthAccessToken(code, params, (err, accessToken, refreshToken, params) => {
        if (err) {
          let parseErrdData = JSON.parse(err.data);
          reject(_.get(parseErrdData, 'error', parseErrdData));
        } else {
          resolve([accessToken, refreshToken, params]);
        }
      });
    })
  }

  /**
   * Ger user hr info from access token
   * @return {object} user info
   * @example
   * {
   *  "orgid"   : "200000000094",
   *  "name"    : "Lâm Nguyễn ",
   *  "email"   : "lam.nguyen seedcom.vn",
   *  "orgname" : "The Coffee House 2",
   *  "role"    : "admin",
   *  "sub"     : "200000000273"
   *  }
   */
  async _getUserHr() {
    const response = await axios({
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${this.response_params.token_type} ${this.access_token}`,
      },
      url: config.hraccount_login.url_get_user_info
    });

    let userInfo = _.get(response, 'data', {});
    if (!userInfo.id) {
      userInfo.id = userInfo.sub;
    }
    let error = _.get(response, 'error', false);

    if (!error && userInfo) {
      return userInfo;
    } else {
      throw new Error('Get User Info Failed');
    }
  }

  async _getEmployeeInfo(hara_id) {
    let [err, res] = await callAPI(callAPI.GET_EMPLOYEE_BY_HR_ID, { haraId : hara_id }, { access_token : this.access_token });
    let error      = _.get(res, 'data.error');
    let employeeInfo     = _.get(res, 'data');
    let message    = _.get(res, 'data.message');

    if (err || error || !_.isObjectLike(employeeInfo)) {
      throw new Error(`Get User Info Failed ${err.message} ${message}`);
    }

    return employeeInfo;
  }

  async _getUserHRFromAccessToken() {
    let [err, res] = await callAPI(callAPI.HR_ME, null, { access_token : this.access_token });
    let error      = _.get(res, 'data.error');
    let userHR     = _.get(res, 'data');
    let message    = _.get(res, 'data.message');

    if (err || error || !_.isObjectLike(userHR)) {
      throw new Error(`Get User Info Failed ${err.message} ${message}`);
    }

    if (!userHR.id) {
      userHR.id = userHR.sub;
    }
    return userHR;
  }
};
