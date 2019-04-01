/**
 * @author Nguyen Hong Quan
 * @edit Tran Dinh Hoang
 * @description move from haraoes
 */

'use strict';

const path                    = require('path');
const config                  = global.config;
const axios                   = require('axios');
const _                       = require('lodash');
const OAuth2                  = require('oauth').OAuth2;
const BaseBusiness            = require(path.resolve('./core/business/base'));
const SettingModel            = require(path.resolve('./modules/admin/setting/model/setting'));
const callAPI                 = require(path.resolve('./helper/call-api'));
const handle                  = require(path.resolve('./helper/handle'));
const VoteGeneralSettingModel = require(path.resolve('./modules/admin/vote-setting/model/voting-general-setting'));
const VoteLimitSettingModel   = require(path.resolve('./modules/admin/vote-setting/model/voting-limit-setting'));

const ADMIN_SCOPES = ['admin', 'hr_api.admin'];

module.exports = class UserLoginHr extends BaseBusiness {
  constructor(code) {
    super();
    this.code            = code;
    this.access_token    = '';
    this.refresh_token   = '';
    this.response_params = {};
    this.user_info       = {};
    this.userLoyaty      = undefined;
  }

  /**
   * Use hr code to get token (access, refresh) and user info
   * @return user info
   */
  async authenication() {
    try {
      let payload = {};
      if (!this.code) {
        // throw new Error('Code not found in request');
      }
      [this.access_token, this.refresh_token, this.response_params] = await this._getHrToken();
      payload             = await this._getUserPayload();
      this.userHR         = await this._getUserHRFromAccessToken();
      payload.email       = _.get(this.userHR, 'username', payload.email);
      payload.employee_id = await this._getEmployeeInfo(this.userHR.orgId, this.userHR.id);
      
      if (this.userHR.orgId != config.hraccount_login.orgId) {
        throw new Error('[ERR_CLIENT] Tài khoản nằm ngoài tổ chức');
      }

      [payload.isManager, payload.departments_managed] = await this._checkManager();

      if (_.get(this.userHR, 'isRoot') || _.size(_.intersection(this.userHR.scope, ADMIN_SCOPES)) > 0) {
        await this._updateHrToken();
        await this._initVoteGeneralSetting(this.userHR);
        await this._initVoteLimitSetting(this.userHR);
      }

      payload.user_info = this.userHR;
      return payload;
    }
    catch (err) {
      this._setError(handle(err));
    }
  }

  async _updateHrToken() {
    let updated_setting = await SettingModel.updated(
      { 
        'orgId'                 : this.userHR.orgId,
        'haravan.is_root'       : _.get(this.userHR, 'isRoot', false),
        'haravan.user_id'       : this.userHR.id,
        'haravan.access_token'  : this.access_token,
        'haravan.refresh_token' : this.refresh_token,
        'haravan.token_type'    : this.response_params.token_type,
        'haravan.expires_in'    : this.response_params.expires_in,  
        'haravan.get_token_at'  : new Date(),
      },
      {
        'orgId': this.userHR.orgId,
      },
      null, null, true
    );
    if (SettingModel.error || !_.isObjectLike(updated_setting)) {
      throw new Error(`[ERR_DB] Có lỗi khi lưu cấu hình, chi tiết lỗi : ${SettingModel.message}`);
    }
    return updated_setting;
  }

  /**
   * Use code to get Hr token info
   * @return {array} [accessToken, refreshToken, params]
   */
  async _getHrToken() {
    try {
      let code = this.code;
      let params = {};
      params.grant_type = config.hraccount_login.grant_type;
      params.redirect_uri = global.env.HR_CALL_BACK_URL;

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
    } catch (error) {
      this._setError('_getHrToken')
    }
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
   async _getUserPayload() {
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
     let error = _.get(response, 'error', false);
 
     if (!error && userInfo) {
      if (!userInfo.id) {
        userInfo.id = userInfo.sub;
      }
      userInfo.orgId = userInfo.orgid;
       return userInfo;
     } else {
       throw new Error('Get User Info Failed');
     }
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

  async _checkManager() {
    let [err, res] = await callAPI(callAPI.HR_SUPERVISOR_DEPARTMENTS, { isGetAll : true }, { access_token : this.access_token });
  
    let departments = _.get(res, 'data', []);
    let departments_id = departments.map(d => d.id);
    return [_.size(departments_id) > 0, departments_id];
  }

  async _getEmployeeInfo(orgId, hara_id) {
    let auth = { orgId : orgId };
    if (_.get(this.userHR, 'isRoot', false)) {
      auth.access_token = this.access_token;
    }
    let [err, res]   = await callAPI(callAPI.GET_EMPLOYEE_BY_HR_ID, { haraId : hara_id }, auth);
    let employee_id = _.get(res, 'data.id');

    return employee_id;
  }

  async _initVoteGeneralSetting(userHR) {
    let setting = await this._getVoteGeneralSetting(userHR);
    if (!_.isObjectLike(setting)) {
      let default_salary_element = await this._getDefaultSalaryElement(userHR);
      const default_setting = {
        'orgid': userHR.orgId,
        'department_salary_element': default_salary_element,
        'employee_salary_element': default_salary_element,
        'employee_voting_close_at': {
          'day': 2,
          'hour': 0,
          'minute': 0
        },
        'employee_voting_open_at': {
          'day': 1,
          'hour': 0,
          'minute': 0
        },
        'manager_voting_close_at': {
          'day': 2,
          'hour': 0,
          'minute': 0
        },
        'manager_voting_open_at': {
          'day': 1,
          'hour': 0,
          'minute': 0
        },
        'user_id': userHR.id,
      };
      let new_setting = await VoteGeneralSettingModel.insert(default_setting);
      if (VoteGeneralSettingModel.error) {
        throw new Error(`[ERR_DB] Init default general setting for org ${userHR.orgId} failed [MESSAGE] ${VoteGeneralSettingModel.message}`);
      }
      return new_setting;
    }
  }

  async _initVoteLimitSetting(userHR) {
    let setting = await this._getVoteLimitSetting(userHR);
    if (!_.isObjectLike(setting)) {
      const default_setting = /* 1 */
      {
        'orgid': userHR.orgId,
        'exchange_mark': {
          '1': {
            'value': 3,
            'round_method': 'ROUND'
          },
          '2': {
            'value': 2,
            'round_method': 'ROUND'
          },
          '3': {
            'value': 1,
            'round_method': 'ROUND'
          }
        },
        'exchange_mark_type': 'FIXED',
        'user_id': userHR.id,
        'voting_limit': {
          '1': {
            'limit': '20',
            'round_method': 'ROUND'
          },
          '2': {
            'limit': '60',
            'round_method': 'ROUND'
          },
          '3': {
            'limit': '20',
            'round_method': 'ROUND'
          }
        }
      };
      let new_setting = await VoteLimitSettingModel.insert(default_setting);
      if (VoteLimitSettingModel.error) {
        throw new Error(`[ERR_DB] Init default limit setting for org ${userHR.orgId} failed [MESSAGE] ${VoteLimitSettingModel.message}`);
      }
      return new_setting;
    }
  }

  async _getDefaultSalaryElement(userHR) {
    let [err, res] = await callAPI(callAPI.HR_LIST_SALARY_ELEMENTS, { page_size : 1 }, { access_token : this.access_token });
    if (err) {
      err.message = `[ERR_SERVICE] List salary element of org ${userHR.orgId} failed [ERROR] ` + err.message;
      throw err;
    }
    return _.get(res, 'data.data[0]');
  }

  async _getVoteGeneralSetting(userHR) {
    let setting = await VoteGeneralSettingModel.selectOne({ orgid : userHR.orgId });
    if (VoteGeneralSettingModel.error) {
      throw new Error(`[ERR_DB] Get vote general setting of org ${userHR.orgId} failed [MESSAGE] ${VoteGeneralSettingModel.message}`);
    }
    return setting;
  }

  async _getVoteLimitSetting(userHR) {
    let setting = await VoteLimitSettingModel.selectOne({ orgid : userHR.orgId });
    if (VoteLimitSettingModel.error) {
      throw new Error(`[ERR_DB] Get vote general setting of org ${userHR.orgId} failed [MESSAGE] ${VoteLimitSettingModel.message}`);
    }
    return setting;
  }
};
