/**
 * @author Tran Dinh Hoang
 * @module callAPI
 */

const _                  = require('lodash');
const axios              = require('axios');
const callApiConfig      = require('./config-call-api/call-api');

module.exports = callAPI;

/////////////////////////////////////////
include(callAPI, callApiConfig);

/**
 * Call API, wrap [axios](https://github.com/axios/axios) package
 * @param {object} api  The object contain api config, require url, method. 
 * @param {object} data The request data or params
 * @param {object} [user] The user that contain some authorization info, ex : access_token, shop_url, orgId
 * 
 * @see [axios-request-config](https://github.com/axios/axios#request-config) for all available config options
 * @return {array} [err, res]
 *  - err : { status, message, data }, maybe :
 *  - - invalid params error : { status : callAPI.INVALID_PARAMS, message : 'invalid api, invalid user, ...' }
 *  - - response error       : { status : status code, message : response error message like 'Request failed with status code 401', data : response data }
 *  - - unexpected error     : { status : callAPI.UNEXPECTED_ERROR, message : '...' } 
 * 
 *  - res : response data
 *
 * @example 
 * 
 * let [err1, res1] = await callAPI(callAPI.HR_OEDER_DETAIL, { order_id : 1001121945 }, user);
 * => err1 = null, res1 = { order : {} }
 * 
 * let [err2, res2] = await callAPI('?', { address : '227 Nguyen Van Cu, Quan 5, Ho Chi Minh' });
 * => err2 = { status : -1, message : 'invalid api' }, res2 = undefined
 */
async function callAPI(api, data, user) {
  let options;
  try {
    let err = await parseParams(api, data, user);
    if (err) {
      return [err];
    } 
    options = buildOptions(user, api, data);
    await pre_send(api, options, user);
    let res = await axios(options);
    await pre_receive(api, res, user);
    writeSuccessLog(res);
    return [null, res.data];
  } catch (err) {
    let status = _.get(err, 'response.status', callAPI.UNEXPECTED_ERROR);
    let err_data = _.get(err, 'response.data', err);
    writeErrorLog(err);
    return [{ message: err.message, status: status, data: err_data, options: options }];
  }
}

async function parseParams(api, data, user) {
  let err = null;

  if (!_.isObjectLike(api) || !_.isString(api.url) || !_.isString(api.method)) {
    err = 'invalid api';
  }
  return err ? { status: callAPI.INVALID_PARAMS, message: err } : undefined;
}

const RESERVE_PATHS = [
  'url_args', 'default_url_args',
  'params', 'default_params', 
  'data', 'default_data', 
  'pre_send', 'pre_receive', 
  'allow_empty_token'
];
function buildOptions(user, api, data) {
  let options = _.omit(api, RESERVE_PATHS);

  // set url arguments, params, data
  let specificData           = _.pick(data, ['url_args', 'params', 'data']);
  if (_.size(specificData) >= 2) {
    options.url              = compile(options.url, specificData.url_args);
    options.params           = specificData.params;
    options.data             = specificData.data;
  }
  else {
    options.url      = compile(options.url, data);
    if (_.lowerCase(api.method) === 'get') {
      options.params = data;
    } else {
      options.data   = data;
    }
  }

  // set default information
  options.headers = _.merge(_.cloneDeep(callAPI.DEFAULT_HEADER), options.headers);
  if (_.isObjectLike(api.default_params) && _.size(api.default_params) > 0) {
    options.params = _.merge(_.cloneDeep(api.default_params), options.params);
  }
  if (_.isObjectLike(api.default_data) && _.size(api.default_data) > 0) {
    options.data   = _.merge(_.cloneDeep(api.default_data), options.data);
  }

  return options;
}

async function pre_send(api, options, user) {
  if (_.isFunction(api.pre_send)) {
    options = await api.pre_send(api, options, user);
  }
}

async function pre_receive(api, res, user) {
  if (_.isFunction(api.pre_receive)) {
    await api.pre_receive(res, user);
  }
}

function writeSuccessLog(res) {
  let time = new Date();
  let formated_time = time.toLocaleString('vi');
  let method = _.toUpper(_.get(res, 'config.method'), 'UNKNOWN METHOD');
  let url = _.get(res, 'config.url', 'UNKNOWN URL');
  let status = res.status || 'UNKNOWN STATUS';

  console.log(`[${formated_time}] ${method} ${url} ${status}`);
}

function writeErrorLog(err) {
  let time = new Date();
  let formated_time = time.toLocaleString('vi');
  let err_msg = err.message;
  let res = err.response;
  let method = 'UNKNOWN_METHOD';
  let url = 'UNKNOWN_URL';
  let status = 'UNKNOWN_STATUS';
  let req_params = '';
  let req_data = '';
  let res_data = '';
  if (_.isObjectLike(err.response)) {
    status = err.response.status || status;
    res_data = err.response.data || res_data;
  }
  if (_.isObjectLike(err.config)) {
    method = _.toUpper(err.config.method) || method;
    url = err.config.url || url;
    req_params = err.config.params || req_params;
    req_data = err.config.data || req_data;
  }

  if (_.isObjectLike(req_params)) req_params = JSON.stringify(req_params);
  if (_.isObjectLike(req_data)) req_data = JSON.stringify(req_data);
  if (_.isObjectLike(res_data)) res_data = JSON.stringify(res_data);

  let log = `ERROR [${formated_time}] ${method} ${url} ${status} ${err_msg} ${res_data}`;
  if (req_params.length) log += ` REQUEST PARAMS : ${req_params}`;
  if (req_data.length) log += ` REQUEST DATA : ${req_data}`;

  console.log(log);
}

function include(objSource, objPlus) {
  if (!_.isObject(objSource) || !_.isObject(objPlus)) return;
  for (let key in objPlus) {
    objSource[key] = objPlus[key];
  }
}


function compile(template, data) {
  let result = template.toString ? template.toString() : '';
  result = result.replace(/{.+?}/g, function (matcher) {
    var path = matcher.slice(1, -1).trim();
    return _.get(data, path, '');
  });
  return result;
}
/////////////// TEST //////////////////////////
// setTimeout(async () => {
//   let user = {
//     shop         : 'zobid.sku.vn',
//     access_token : 'Tkx6iRSJudspMas0Ni6zD3NOVl_GXLHftPXRdpC49Zp3YAMHDGusmXBeFSiPxaNVvi-u3fGsxb0DSLUPh71m9xI3N_y8DsudV_nm5YXeGTGG9U5QIQEtebo2E52yVOd0M9gNMBOewFV-r5IL2VFoQ-V_B_6wMYSgMH9ESIjJhHw72Ut9kqJP6fNxnJ94VR7y6Ut_79QeeU7i-qAOQ3pV6SsZ3r8ZSFj_VDHxxMX9YC3NwFhaSQP6r5OJ1Nz0j2p3zRgTuYbFaoZnKeH3pB-ny9cL1Yo5Qyo810XK2h3eliJSp-rd8E1xtkBkbj8tFztTdwTn8oS-6DoDDqsw-bYDGdKQHx_kWylIgxyP13NN5dPlVL885F71JCB-CIMjwfZgySygt_hrWrDmPtIUOzDT69yKmPZQwFuqagngTUCIHENu96ITDZntS5lvc_e7pvMa4vIDiYYEr_P_nq7HqSYoRT2In20F_ds0UxT4HLAYaAlBrSQ_8BSxGnqyvh9THMZSwbPb04aIgGbTj5FPPYfwVotLblehbV8G_Qe-kakc7elcGsDWFglLa9yhfsJliQXwu5Q'
//   };
//   let [err1, res1] = await callAPI(callAPI.HR_OEDER_DETAIL, { order_id : 1001121945 }, user);
//   let [err2, res2] = await callAPI(callAPI.GOOGLE_GET_COORDINATE, { address : '227 Nguyen Van Cu, Quan 5, Ho Chi Minh' });
//   let [err3, res3] = await callAPI(callAPI.AHAMOVE_ESTIMATE_FEE, { 
//     order_time : 1540735024,
//     path       : JSON.stringify([{"address":"500 Trần Hưng Đạo, Cầu Ông Lãnh, District 1, Ho Chi Minh City"},{"address":"227 Nguyễn Văn Cừ, phường 4, District 5, Ho Chi Minh City"}]),
//     service_id : 'SGN-BIKE',
//    });
// }, 5000);

