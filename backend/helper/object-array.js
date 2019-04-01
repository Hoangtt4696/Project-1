'use strict';

const _                  = require('lodash');
const mongoose           = require('mongoose');
const ObjectId           = mongoose.mongo.ObjectId;
const path               = require('path');
const helperStringNumber = require(path.resolve('./helper/string-number.js'));

exports.validateObject = function (object) {
  return (object && typeof object === "object" && Object.keys(object).length && object !== null && object !== undefined);
};

exports.validateArray = function (arr) {
  return (arr && typeof arr === "object" && Array.isArray(arr) && arr.length);
};

exports.filledArray = (val) => {
  return (Array.isArray(val) && val.length > 0);
}

exports.sameArray = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (!_.equal(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Check whether val is a mongoose document
 * @param {*} val 
 */
exports.doc = (val) => {
  if (!module.exports.filledObject(val)) {
    return false;
  }
  return module.exports.filledObject(val._doc) && typeof val.toObject === 'function';
}
/* fix call maximum excec by object promise  */
exports.simpleObj = function (obj) {
  let cache = [];
  // Demo: Circular reference
  // var o = {};
  // o.o = o;
  let text = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found
        try {
          // If this value does not reference a parent it can be deduped
          return JSON.parse(JSON.stringify(value));
        } catch (error) {
          // discard key if value cannot be deduped
          return;
        }
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  obj = JSON.parse(text);
  return obj;
};

exports.clearObject = (obj, dirtyValues = [null, undefined, '']) => {
  obj = module.exports.simpleObj(obj);
  if (typeof dirtyValues === 'string')
    dirtyValues = [dirtyValues];

  if (!Array.isArray(dirtyValues) || dirtyValues.length <= 0) return;

  if (obj !== undefined && obj !== null && typeof obj === 'object') {
    let fields = Object.keys(obj);
    fields.forEach(field => {
      if (dirtyValues.includes(obj[field])) {
        _.unset(obj, field);
      }
      if (typeof obj[field] === 'object' || Array.isArray(obj[field])) {
        clearObject(obj[field]);
      }
    });
  }

  if (Array.isArray(obj)) {
    obj.forEach(elem => {
      clearObject(elem);
    });
  }
};

/**
 * Check whether the value is an object have least one path,
 *  and [if paths provided] contain all path in paths
 * @example
 * _is.filledObject({ id : 1000 })                                => true
 * _is.filledObject('bibo')                                       => false
 * _is.filledObject({ id : 1000 }, ['id', 'name'])                => false
 * _is.filledObject({ id : 1000, name : 'bibo'}, ['id', 'name'])  => true
 * @param {any} val - value want to check
 * @param {string|string[]} [paths] - path(s) that the object must contain all
 * 
 * @returns {boolean} true or false
 */
exports.filledObject = (val, paths) => {
  let pass = module.exports.validateObject(val);
  if (paths) {
    pass = _.has(val, paths);
  }
  
  
  return pass;
}

exports.composeOptions = function (default_options, options) {
  default_options = module.exports.filledObject(default_options) ? default_options : {};
  options = module.exports.filledObject(options) ? options : {};
  module.exports.clearObject(options);
  return Object.assign(default_options, options);
}