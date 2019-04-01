'use strict'
let path = require('path');
let helperDateTime = require(path.resolve('./helper/date-time.js'));
exports.buildFilterInArray = (arrFields, data, filter) => {
  arrFields.map(function (item, index) {
    if (data.hasOwnProperty(item) && data[item] && data[item].length) {
      let arrIn = data[item].split(',');
      filter[item] = { '$in': arrIn };
    }
  });
  return filter;
}

exports.buildFilterSearchLike = (arrFields, data, filter) => {
  arrFields.map(function (item, index) {
    if (data.hasOwnProperty(item) && data[item]) {
      filter[item] = { '$regex': '.*' + data[item] + '.*' };
    }
  });
  return filter;
}

exports.buildFilterEqual = (arrFields, data, filter) => {
  arrFields.map(function (item, index) {
    if (data.hasOwnProperty(item)) {
      filter[item] = data[item];
    }
  });
  return filter;
}

exports.buildFilterBetween = (field, data, filter) => {
  let val = {};
  let key_search_from = 'gte_' + field;
  if (field && data.hasOwnProperty(key_search_from) && data[key_search_from]) {
    let item = data[key_search_from];
    if (new Date(data[key_search_from])) {
      item = new Date(data[key_search_from]);
      helperDateTime.setStartOfDay(item);
    }
    val['$gte'] = item;
    filter[field] = val;
  }

  let key_search_to = 'lte_' + field;
  if (field && data.hasOwnProperty(key_search_to) && data[key_search_to]) {
    let item = data[key_search_from];
    if (new Date(data[key_search_to])) {
      item = new Date(data[key_search_to]);
      helperDateTime.setEndOfDay(item);
    }
    val['$lte'] = item;
    filter[field] = val;
  }

  return filter;
}

exports.buildFilterBetweenList = (arrFields, data, filter) => {
  arrFields.map(function (item, index) {
    filter = exports.buildFilterBetween(item, data, filter);
  });

  return filter;
}

exports.setKeyword = (data, fields, criteria) => {
  if (data.hasOwnProperty('keyword') && fields && fields.length) {
    criteria['$or'] = [];
    fields.map(function (item, index) {
      let field = {};
      field[item] = new RegExp(data.keyword, 'i');
      criteria['$or'].push(field);
    });
  }
  return criteria;
}