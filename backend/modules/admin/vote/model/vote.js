'use strict';

const path              = require('path');
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const _                 = require('lodash');
const hintPlugin        = require('mongoose-hint');
const autoIncrement     = require('mongoose-auto-increment');
const BaseModel         = require(path.resolve('./core/model/mongo/base.js'));
const helperBuildQuery  = require(path.resolve('./helper/build-query.js'));
const helperDate       = require(path.resolve('./helper/date-time'));

autoIncrement.initialize(mongoose.connection);

var VoteSchema = new Schema({
  orgid   : { type: String, default: 0 }, 
  user_id : { type: Number, default: 0 },

  name    : { type: String, required: true, default: '' },
  department_unit         : [],
  department              : [],
  department_active       : [],
  department_detail       : [{
    _id: false,
    id: { type: Number, default: 0 },
    name: { type: String, default: '' }
  }],
  job_title               : [],
  number_of_contract_days : { type: Number, default: 0 },
  contract_condition      : { type: Number, default: 0 },
  code                    : { type: Number, default: 0 },

  time_vote_manager: { 
    from :  { type: Number, default: 0 },
    to   :  { type: Number, default: 0 }
  },
  time_vote_employee: { 
    from :  { type: Number, default: 0 },
    to   :  { type: Number, default: 0 }
  },
  year_month_vote : { type: Number, default: 0 },
  created_at      : { type: Number, default: Date.now, set : helperDate.toTimestamp },
  updated_at      : { type: Number, default: null },

  activate        : { type: Boolean, default: true },
  status          : { type: Number, default: 0 },
  amount          : { type: Number, default: 0 },
  employee_list   : [{
    _id: false,
    employee_name      : { type: String, default: '' },
    employee_photo     : { type: String, default: '' },

    employee_job_title_id : { type: Number, default: 0 },
    employee_job_title    : { type: String, default: '' },

    employee_id        : { type: Number, default: 0 },
    employee_userId    : { type: String, default: '' },
    employee_haraId    : { type: Number, default: 0 },

    employee_department_vote : { type: Number, default: 0 },
    employee_department_vote_name : { type: String, default: '' },
    employee_department_id   : { type: Number, default: 0 },
    employee_department_name : { type: String, default: '' },

    join : { type: Boolean, default: true },
    point: { type: Number, default: 0 },
    point_type: {
      1 : {type: Number, default: 0},
      2 : {type: Number, default: 0},
      3 : {type: Number, default: 0}
    }
  }]
});

// Index
const INDEX_SCHEMA_FILTER_1 = {'org_id': 1};
const INDEX_SCHEMA_FILTER_2 = {'user_id': 1};
const INDEX_SCHEMA_FILTER_3 = { 'unit_type': 1 };
const INDEX_SCHEMA_FILTER_4 = { 'job_title': 1 };
const INDEX_SCHEMA_FILTER_5 = { 'number_of_contract_days': 1 };

VoteSchema.plugin(hintPlugin.find, [
  INDEX_SCHEMA_FILTER_1,
  INDEX_SCHEMA_FILTER_2,
]);

VoteSchema.plugin(autoIncrement.plugin, {
  model       : global.config.prefix_db + 'Vote',
  field       : 'code',
  startAt     : 100000,
  incrementBy : 1
});

VoteSchema.index(INDEX_SCHEMA_FILTER_1);
VoteSchema.index(INDEX_SCHEMA_FILTER_2);
VoteSchema.index(INDEX_SCHEMA_FILTER_3);
VoteSchema.index(INDEX_SCHEMA_FILTER_4);
VoteSchema.index(INDEX_SCHEMA_FILTER_5);
/**
* @exports  VoteModel
*/
let exportLists = {
  model: mongoose.model(global.config.prefix_db + 'Vote', VoteSchema),

  /**
   * @description create date
   * @param  {object} data
   */
  preInsert: (data) => {
    delete data._id;
    delete data.code;

    return data;
  },

  /**
   * @description update data
   * @param  {object} data
   */
  preUpdate: (data) => {
    return data;
  },

  /**
   * @param  {object} data
   */
  preUpsert: (data) => {
    return data;
  },

  /**
   * @param  {object} filter
   * @param  {number} skip
   * @param  {number} limit
   * @param  {number} sort
   */
  buildQuery: (filter) => {
    let criteria = {};
    //Search equal
    let arrEqual = ['_id', 'year_month_vote', 'activate', 'orgid'];
    criteria = helperBuildQuery.buildFilterEqual(arrEqual, filter, criteria);
    //Search between
    let arrBetween = ['created_at', 'updated_at'];
    criteria = helperBuildQuery.buildFilterBetweenList(arrBetween, filter, criteria);

    if (filter.hasOwnProperty('department_active_id')) {
      criteria.department_active = {$elemMatch: { $in : filter.department_active_id }};
    }

    if (filter.hasOwnProperty('employee_id')) {
      criteria.employee_list = {$elemMatch: { employee_id: filter.employee_id }};
    }

    return criteria;
  },
  error     : false,
  message   : [],

};

module.exports = _.defaults(new BaseModel(exportLists), exportLists);