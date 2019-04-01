/**
 * @author Tran Dinh Hoang
 */

const _            = require('lodash');
const path         = require('path');
const axios        = require('axios');
const FormData     = require('form-data');
const config       = global.config;
const logger       = require(path.resolve('./helper/logger'));
const SettingModel = require(path.resolve('./modules/admin/setting/model/setting'));

module.exports = {
  get     : getToken,
  refresh : refreshToken,
};

async function getToken(api, options, user) {
  if (!_.isObjectLike(user)) {
    throw new Error(`Invalid user ${user}`);
  }
  let token      = _.get(user, 'access_token');
  let token_type = _.get(user, 'hr_setting.token_type', 'bearer');
  if (typeof token !== 'string' || token.length < 3) {
    if (!_.gt(user.orgId, 0)) {
      throw new Error(`Invalid orgId ${user.orgId} of user ${JSON.stringify(user)}`);
    }
    let token_info = await getRootTokenInfo(user.orgId);
    if (isExpired(token_info)) {
      token_info = await refreshToken(user.orgId, token_info);
    }
    token      = _.get(token_info, 'access_token', '');
    token_type = _.get(token_info, 'token_type', 'bearer');
  }
  _.set(options, 'headers.Authorization', token_type + ' ' + token);
}

async function getRootTokenInfo(orgId) {
  let setting = await SettingModel.selectOne({
    'orgId'           : orgId,
    // 'haravan.is_root' : true,
  });
  if (SettingModel.error || !_.isObjectLike(setting)) {
    throw new Error(`Cann't find root setting of orgId ${orgId} ${SettingModel.message}`);
  }
  let token = _.get(setting, 'haravan.access_token');
  if (typeof token !== 'string' || token.length < 3) {
    throw new Error(`Org ${orgId} setting have no haravan access token`);
  }
  return setting.haravan;
}

function isExpired(tokenInfo) {
  let get_token_at = new Date(tokenInfo.get_token_at);
  let expire_at    = get_token_at.getTime() + tokenInfo.expires_in * 1000;
  let now          = (new Date()).getTime();
  return now >= expire_at;
}

/**
 * Refresh haravan token expired
 * @param {number} orgId
 * @param {object} tokenInfo
 * @return {object} new token info
 */
async function refreshToken(orgId, tokenInfo) {
  try {
    let form = new FormData();
    form.append('grant_type', 'refresh_token');
    form.append('client_id', config.hraccount_login.clientID);
    form.append('client_secret', config.hraccount_login.clientSecret);
    form.append('refresh_token', tokenInfo.refresh_token);

    let res = await axios({
      method        : 'post',
      headers       : form.getHeaders(),
      url           : config.hraccount_login.url_connect_token,
      data          : form,
    });

    let newInfo          = _.get(res, 'data', {});
    newInfo              = _.merge(tokenInfo, newInfo);
    newInfo.get_token_at = new Date();

    updateHrSetting(orgId, newInfo);
    return newInfo;
  }
  catch (err) {
    throw new Error(`ERROR Refresh haravan token : ${err.message} BODY ${_.get(err, 'response.data', '')}`);
  }
}

async function updateHrSetting(orgId, tokenInfo) {
  let filter = {
    'orgId'           : orgId,
    'haravan.user_id' : tokenInfo.user_id
  };
  let data = {
    haravan : tokenInfo
  };
  let new_setting = await SettingModel.updated(data, filter);
  if (!_.isObjectLike(new_setting)) {
    logger.error(`ERROR Can't update setting after refresh haravan token : ${SettingModel.message}`);
  }
  return new_setting;
}