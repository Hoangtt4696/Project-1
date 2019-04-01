/**
 * @author Tran Dinh Hoang
 */

'use strict';

const _                = require('lodash');
const mongoose         = require('mongoose');
const Schema           = mongoose.Schema;
const hintPlugin       = require('mongoose-hint')
const path             = require('path');
const BaseModel        = require(path.resolve('./core/model/mongo/base'));
const helperBuildQuery = require(path.resolve('./helper/build-query.js'));
const helperString     = require(path.resolve('./helper/string-number'));

const VotingGeneralSettingSchema = new Schema({
  orgid   : { type: String, default: 0, require : true, unique : true },
  user_id : { type: String, default: 0 },

  voting_guide : { type: String, default : '', set : helperString.utf8ToBase64, get : helperString.base64ToUtf8 },
  manager_voting_open_at : {
    day    : { type: Number, default: 0 },
    hour   : { type: Number, default: 0 },
    minute : { type: Number, default: 0 },
  },
  manager_voting_close_at : {
    day    : { type: Number, default: 0 },
    hour   : { type: Number, default: 0 },
    minute : { type: Number, default: 0 },
  },
  employee_voting_open_at : {
    day    : { type: Number, default: 0 },
    hour   : { type: Number, default: 0 },
    minute : { type: Number, default: 0 },
  },
  employee_voting_close_at : {
    day    : { type: Number, default: 0 },
    hour   : { type: Number, default: 0 },
    minute : { type: Number, default: 0 },
  },
  
  employee_salary_element : {
    code : { type: String, default : '' },
    authenticateCode: { type: String, default : '' }
  },

  department_salary_element : {
    code : { type: String, default : '' },
    authenticateCode: { type: String, default : '' }
  },

  created_at : { type : Date, default : Date.now },
  updated_at : { type : Date, default : null },
}, {
  toObject          : { getters: true, setters: true },
  toJSON            : { getters: true, setters: true },
  runSettersOnQuery : true
});

const INDEX_SCHEMA_FILTER_1 = {'org_id': 1};
const INDEX_SCHEMA_FILTER_2 = {'user_id': 1};

// set the plugin with the hints to use, in order of priority
VotingGeneralSettingSchema.plugin(hintPlugin.find, [
  INDEX_SCHEMA_FILTER_1,
  INDEX_SCHEMA_FILTER_2,
]);

VotingGeneralSettingSchema.index(INDEX_SCHEMA_FILTER_1);
VotingGeneralSettingSchema.index(INDEX_SCHEMA_FILTER_2);

let exportLists = {
  model     : mongoose.model(global.config.prefix_db + 'Voting_general_setting', VotingGeneralSettingSchema),
  preInsert : (data) => data,
  preUpdate : (data) => data,
  preUpsert : (data) => data,
  buildQuery: (filter) => {
    let criteria = {};
    let arrEqual = ['orgid', 'user_id'];
    let arrBetween = ['created_at', 'updated_at'];

    criteria = helperBuildQuery.buildFilterEqual(arrEqual, filter, criteria);
    criteria = helperBuildQuery.buildFilterBetweenList(arrBetween, filter, criteria);

    return criteria;
  },
  error     : false,
  message   : [],
}

module.exports = _.defaults(new BaseModel(exportLists), exportLists);
