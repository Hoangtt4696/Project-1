const _ = require('lodash');

exports.isObjectId = (val) => {
  return ObjectId.isValid(val);
}

exports.isAllDigit = (val) => {
  return /^[0-9]+$/.test(val);
}

exports.hasValue = (val, notAllowValue = [null, '', undefined, NaN]) => {
  return notAllowValue.indexOf(val) < 0;
}

exports.removeProtocol = (url) => {
  return url.replace(/(^\w+:|^)\/\//, '');
}
/**
 * check whether val is a string,
 *  and have min length, max length match params provided
 * @param {any} val 
 * @param {number} [minLength] 
 * @param {number} [maxLength] 
 * 
 * @returns {boolean} true or false
 */
exports.filledString = (val, minLength = 1, maxLength = Number.MAX_SAFE_INTEGER) => {
  return (
    (typeof val === 'string' || val instanceof String)
    && val.length >= minLength && val.length <= maxLength
  );
}

exports.positive = (val) => {
  return (
    (typeof val === 'number' || val instanceof Number)
    && val >= 0
  );
}

exports.isGt0 = (val) => {
  return (
    (typeof val === 'number' || val instanceof Number)
    && val > 0
  );
}

exports.isPhone = (val) => {
  return /^(\+[1-9][0-9]*(\s|\([0-9]*\)|-[0-9]*-))?[0]?[1-9][0-9\- ]*$/.test(val);
}

exports.isEmail = (val) => {
  return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(val);
}

exports.isDate = (val) => {
  return (val instanceof Date && !isNaN(val.getTime()));
}


exports.isAlphabe = (val) => {
  let a = (/^[*\wAÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴaàáạảãâầấậẩẫăằắặẳẵEÈÉẸẺẼÊỀẾỆỂỄeèéẹẻẽêềếệểễIÌÍỊỈĨiìíịỉĩOÒÓỌỎÕoòóọỏõÔỒỐỘỔỖôồốộổỗƠỜỚỢỞỠơờớợởỡUÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸuùúụủũưừứựửữyỳýỵỷỹĐđ\w\s]+[^(!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?)]*$/).test(val);
  return a;
};

exports.utf8ToBase64 = function(val) {
  let nval = Buffer.from(_.toString(val), 'utf8').toString('base64');
  return nval;
}

exports.base64ToUtf8 = function(val) {
  let nval = Buffer.from(_.toString(val), 'base64').toString('utf8');
  return nval;
}
