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

const UserTokenSchema = new Schema({
  orgid      : {type: String, required: true},
  user_id    : {type: String, required: true}, // email
  token      : {type: String, required: true},
  status     : {type: Number, default: 0},
  created_at : {type: Date, default: Date.now},
  expired_at : {type: Number, default: Date.now},
  udpated_at : {type: Date, default: Date.now},
});


UserTokenSchema.statics.STATUS_ACTIVE = 0;
UserTokenSchema.statics.STATUS_HAS_MODIFY = 1;
// Index
const INDEX_SCHEMA_FILTER_1 = {'user_id': 1};
const INDEX_SCHEMA_FILTER_2 = {'status': 1};

// set the plugin with the hints to use, in order of priority
UserTokenSchema.plugin(hintPlugin.find, [
  INDEX_SCHEMA_FILTER_1,
  INDEX_SCHEMA_FILTER_2,
]);

UserTokenSchema.index(INDEX_SCHEMA_FILTER_1);
UserTokenSchema.index(INDEX_SCHEMA_FILTER_2);

let exportLists = {
  model     : mongoose.model(global.config.prefix_db + 'User_token', UserTokenSchema),
  preInsert : (data) => data,
  preUpdate : (data) => data,
  preUpsert : (data) => data,
  buildQuery: (filter) => {
    let criteria = {};
    let arrEqual = ['orgid', 'user_id', 'token', 'status'];
    let arrBetween = ['created_at', 'expired_at', 'updated_at'];

    criteria = helperBuildQuery.buildFilterEqual(arrEqual, filter, criteria);
    criteria = helperBuildQuery.buildFilterBetweenList(arrBetween, filter, criteria);

    return criteria;
  },
  error     : false,
  message   : [],
}

module.exports = _.defaults(new BaseModel(exportLists), exportLists);
