'use strict';

const _    = require('lodash');
const util = require('util');

const ERROR_CODES = {
  ERR_CLIENT       : 'ERR_CLIENT',
  ERR_SYSTEM       : 'ERR_SYSTEM',
  ERR_DB           : 'ERR_DB',
  ERR_SERVICE      : 'ERR_SERVICE',
  ERR_UNEXPECTED   : 'ERR_UNEXPECTED',
  DEFAULT          : 'ERR_UNEXPECTED'
};

const ERROR_HANDLERS = {
  [ERROR_CODES.ERR_CLIENT    ] : handleClientError,
  [ERROR_CODES.ERR_SYSTEM    ] : handleServerError,
  [ERROR_CODES.ERR_DB        ] : handleServerError,
  [ERROR_CODES.ERR_SERVICE   ] : handleServerError,
  [ERROR_CODES.ERR_UNEXPECTED] : handleServerError,
};

// Error message reply to client
const ERROR_MESSAGES = {
  [ERROR_CODES.ERR_SYSTEM    ] : 'Có lỗi trong quá trình xử lý. Vui lòng thử lại sau ít phút.',
  [ERROR_CODES.ERR_UNEXPECTED] : 'Có lỗi trong quá trình xử lý. Vui lòng thử lại sau ít phút.',
  [ERROR_CODES.ERR_DB        ] : 'Có lỗi trong quá trình xử lý. Vui lòng thử lại sau ít phút.',
  [ERROR_CODES.ERR_SERVICE   ] : 'Có lỗi trong quá trình xử lý. Vui lòng thử lại sau ít phút.',
};

function handle(error) {
  let [error_code, _error] = parseError(error);
  let handler              = _.get(ERROR_HANDLERS, error_code, ERROR_HANDLERS.ERR_UNEXPECTED);
  return handler(_error, error_code);
}

function parseError(error) {
  if (typeof error === 'string') {
    error = new Error(error);
  }
  if (!_.isObject(error)) {
    error = new Error(`[${ERROR_CODES.DEFAULT}] Unknown error : ${JSON.stringify(error)}`);
  }
  if (typeof error.message !== 'string') {
    error.message = `[${ERROR_CODES.DEFAULT}] Unknown error message`;
  }

  let error_code;
  error.message = error.message.replace(/\[ERR_.+] /, (match) => {
    error_code = match.slice(1, -2);
    return '';
  });

  if (error_code === undefined) {
    error_code = ERROR_CODES.DEFAULT;
  }

  return [error_code, error];
}

//-------------------------------------------- HANDLERS -------------------------------------------------

function handleClientError(error) {
  return error.message;
}

function handleServerError(error, error_code) {
  console.log(`[${error_code}] [${_now()}] ${inspect(error)}`);
  return ERROR_MESSAGES.ERR_SYSTEM;
}

// function handleSystemError(error) {
//   console.log(`[${ERROR_CODES.ERR_SYSTEM}] [${_now()}] ${inspect(error)}`);
//   return ERROR_MESSAGES.ERR_SYSTEM;
// }

// function handleUnexpectedError(error) {
//   console.log(`[${ERROR_CODES.ERR_UNEXPECTED}] [${_now()}] ${inspect(error)}`);
//   return ERROR_MESSAGES.ERR_UNEXPECTED;
// }

//-------------------------------------------- UTILITIES -------------------------------------------------
function inspect(obj) {
  return util.inspect(obj, false, null, false);
}

function _now() {
  return (new Date()).toLocaleString('vi');
}

//-------------------------------------------- PUBLIC -------------------------------------------------
module.exports = handle;
module.exports.ERROR_CODES = ERROR_CODES