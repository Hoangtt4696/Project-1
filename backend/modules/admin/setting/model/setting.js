/**
 * @author Tran Dinh Hoang
 */

'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');
const BaseModel = require(path.resolve('./core/model/mongo/base'));
const helperBuildQuery = require(path.resolve('./helper/build-query.js'));
const helperDate = require(path.resolve('./helper/date-time'));


const SettingSchema = new Schema({
  orgId         : { type : Number, require : true, default : 0, unique: true },
  haravan : {
    is_root       : { type : Boolean, default : false },
    user_id       : { type : String, default : '' }, // email
    access_token  : { type : String, default : '' },
    refresh_token : { type : String, default : '' },
    expires_in    : { type : Number, default : 0 },
    get_token_at  : { type : Number, default : 0, set : helperDate.toTimestamp },
    token_type    : { type : String, default : '' },
  },
  payment_token   : { type : String, default : '' }
}, 
{ versionKey : false });

const INDEX_1 = { 'orgId' : 1 };
const INDEX_2 = { 'haravan.email' : 1 };

SettingSchema.index(INDEX_1);
SettingSchema.index(INDEX_2);

let exportLists = {
  model: mongoose.model(global.config.prefix_db + 'Setting', SettingSchema),
  preInsert: (data) => data,
  preUpdate: (data) => data,
  preUpsert: (data) => data,
  buildQuery: (filter) => {
    let criteria = {};
    let arrEqual = ['orgId', 'haravan.user_id', 'haravan.access_token', 'haravan.refresh_token', 'haravan.token_type'];
    let arrBetween = ['haravan.get_token_at'];

    criteria = helperBuildQuery.buildFilterEqual(arrEqual, filter, criteria);
    criteria = helperBuildQuery.buildFilterBetweenList(arrBetween, filter, criteria);
    return criteria;
  },
  error: false,
  message: [],
}

// mongoose.model(global.config.prefix_db + '_Users_Token', UserTokenSchema);
module.exports = _.defaults(new BaseModel(exportLists), exportLists);