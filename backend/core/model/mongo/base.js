'use strict'
/**
 * this is BaseClass.
 */

let path = require('path');
let _ = require('lodash');
let logger = require(path.resolve('./helper/logger.js'));

require(path.resolve('./connect_db/mongodb.js'));
var BaseRead = require(path.resolve('./core/model/mongo/model-read.js'));
var BaseWrite = require(path.resolve('./core/model/mongo/model-write.js'));

let messageDefault = 'Có lỗi xảy ra vui lòng thử lại lúc khác [##code##]';
let code = {
  'insert': 'MG001',
  'updatedOne': 'MG002',
  'updated': 'MG003',
  'deleted': 'MG004',
  'select': 'MG005',
  'selectOne': 'MG006',
  'count': 'MG007',
  'startQuery': 'MG008',
}
function getFunctionNameDefault(model, fn, endFix = '') {
  if (typeof fn !== 'string' || fn === '') {
    fn = model.moduleName + ' ' + endFix;
  }
  return fn;
}

function setPropFilter(buildFilter, filter, obj) {
  obj.criteria = buildFilter(filter);
  obj.limit = _.get(filter, 'limit', -1);
  obj.sort = _.get(filter, 'sort', {});
  obj.select_field = _.get(filter, 'select_field', []);
  obj.lean = _.get(filter, 'lean', false);
  if (obj.limit > -1) {
    let page = _.get(filter, 'page', 1);
    obj.skip = (page - 1) * obj.limit;
  }
  return obj;
}



function initDefault(obj, defaults = {}) {
  obj.model = _.get(defaults, 'model', null);
  obj.error = _.get(defaults, 'error', false);
  obj.message = _.get(defaults, 'message', []);
  obj.preInsertDefault = _.get(defaults, 'preInsert', null);
  obj.preUpdateDefault = _.get(defaults, 'preUpdate', null);
  obj.buildFilterDefault = _.get(defaults, 'buildQuery', null);
  obj.buildAggregateDefault = _.get(defaults, 'buildAggregate', null);
}
function setError(obj, fn, message = [], error = true, objectData = {}) {
  obj.error = error;
  let time = new Date().toISOString();
  if (error === true) {
    let res_message = messageDefault.replace('##code##', code[obj.fnBase]) + ' ' + time;
    if (typeof message === 'string') {
      message = [message];
    }
    obj.message = res_message;
    let log = {
      message: message,
      fn: fn,
      time: time,
      data: objectData
    }
    logger.error(log);
  } else {
    obj.error = false;
    obj.message = [];
  }
}

function resetError(obj) {
  obj.error = false;
  obj.message = [];
}

class BaseModel {
  constructor(defaults = {}) {
    this.error = false;
    this.message = [];
    this.model = null;
    this.fnBase = null;
    this.fnBase = null;
    this.preInsertDefault = null;
    this.preUpdateDefault = null;
    this.buildFilterDefault = null;
    this.buildAggregateDefault = null;
    initDefault(this, defaults);
  }

  async select(filter = {}, buildFilter) {
    this.fnBase = 'select';
    let obj = new BaseRead(this.model);
    let res = [];
    buildFilter = buildFilter ? buildFilter : this.buildFilterDefault;
    if (typeof buildFilter === 'function') {
      obj = setPropFilter(buildFilter, filter, obj);
      res = await obj.select();
      setError(this, 'select', obj.message, obj.error, { filter });
    } else {
      setError(this, 'select', 'build filter is null', true, { filter });
    }
    return res;
  }

  async count(filter = {}, buildFilter) {
    this.fnBase = 'count';
    let obj = new BaseRead(this.model);
    let res = 0;
    buildFilter = buildFilter ? buildFilter : this.buildFilterDefault;
    if (typeof buildFilter === 'function') {
      obj = setPropFilter(buildFilter, filter, obj);
      res = await obj.count();
      setError(this, 'count', obj.message, obj.error, { filter });
    } else {
      setError(this, 'count', 'build filter is null', true, { filter });
    }

    return res;
  }

  async selectOne(filter = {}, buildFilter) {
    resetError(this);
    this.fnBase = 'selectOne';
    let obj = new BaseRead(this.model);
    let res = null;
    buildFilter = buildFilter ? buildFilter : this.buildFilterDefault;
    if (typeof buildFilter === 'function') {
      obj = setPropFilter(buildFilter, filter, obj);
      res = await obj.selectOne();
      setError(this, 'selectOne', obj.message, obj.error, { filter });
    } else {
      setError(this, 'selectOne', 'build filter is null', true, { filter });
    }

    return res;
  }

  async aggregate(filter = {}, buildAggregate) {
    this.fnBase = 'aggregate';
    let obj = new BaseRead(this.model);
    let res = null;
    buildAggregate = buildAggregate ? buildAggregate : this.buildAggregateDefault;
    if (typeof buildAggregate === 'function') {
      obj.aggregate = buildAggregate(filter);
      res = await obj.aggregate();
      setError(this, 'aggregate', obj.message, obj.error, { filter });
    } else {
      setError(this, 'aggregate', 'build aggregate is null', true, { filter });
    }

    return res;
  }

  async insert(data, fn = '', format) {
    resetError(this);
    this.fnBase = 'insert';
    let obj = new BaseWrite(this.model);
    let result = null;
    format = format ? format : this.preInsertDefault;
    if (typeof format === 'function') {
      fn = getFunctionNameDefault(this.model, fn, 'insert');
      result = await obj.insert(format(data));
      setError(this, fn, obj.message, obj.error, { data });
    } else {
      setError(this, fn, 'format is null');
    }

    return result;
  }

  async updated(data, filter, fn = '', format, upsert = false) {
    this.fnBase = 'updated';
    let obj = new BaseWrite(this.model);
    let result = null;
    format = format ? format : this.preUpdateDefault;
    if (typeof format === 'function') {
      fn = getFunctionNameDefault(this.model, fn, 'updated');
      result = await obj.updated(format(data), filter, upsert);
      setError(this, fn, obj.message, obj.error, { data, filter });
    } else {
      setError(this, fn, 'format function is null');
    }

    return result;
  }

  async updatedMulti(data, filter, fn = '', format, upsert = false) {
    this.fnBase = 'updatedMulti';
    let obj = new BaseWrite(this.model);
    let result = null;
    format = format ? format : this.preUpdateDefault;
    if (typeof format !== 'function') {
      fn = getFunctionNameDefault(this.model, fn, 'updatedMulti');
      result = await obj.updatedMulti(format(data), filter, upsert);
      setError(this, fn, obj.message, obj.error, { data, filter });
    } else {
      setError(this, fn, 'format function is null');
    }
    return result;
  }

  async deleted(filter, fn = '') {
    this.fnBase = 'deleted';
    let obj = new BaseWrite(this.model);
    let result = null;
    try {
      fn = getFunctionNameDefault(this.model, fn, 'deleted');
      result = await obj.deleted(filter);
      setError(this, fn, obj.message, obj.error, { filter });
    } catch (error) {
      setError(this, fn, 'preUpdate is null');
    }

    return result;
  }
}




module.exports = BaseModel;


