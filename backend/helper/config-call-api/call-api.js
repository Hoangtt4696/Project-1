'use strict';

const _             = require('lodash');
const HARAVAN_API   = require('./haravan');
const HARA_WORK_API = require('./hara-work');


let callAPI = {};

module.exports = callAPI;

//////////////////////////
include(callAPI, HARAVAN_API);
include(callAPI, HARA_WORK_API);

callAPI.INVALID_PARAMS   = -1;
callAPI.UNEXPECTED_ERROR = -3;

callAPI.DEFAULT_HEADER = {
  'accept'        : '*/*',
  'timeout'       : 5000,
  'Content-Type'  : 'application/json'
};

function include(objSource, objPlus) {
  if (!_.isObject(objSource) || !_.isObject(objPlus)) {
    return;
  }
  for (let key in objPlus) {
    objSource[key] = objPlus[key];
  }
}