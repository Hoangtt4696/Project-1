'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('lodash');
let BaseModel = require(path.resolve('./core/model/mongo/base.js'));
let helperBuildQuery = require(path.resolve('./helper/build-query.js'));
let helperObjectArray = require(path.resolve('./helper/object-array.js'));

/**
 * User Schema
 * Params:
 * staff_id: Mã nhân viên
 * is_deleted: lệnh xóa từ webhook
 * text_search: full text search
 * account : webhook user json
 */
var UserSchema = new Schema({
  haraoesapp_extend_data: {
    hr_token: { type: String, default: '' },
    user_auto: { type: Number, default: 0 },
    hr_id: { type: String, trim: true, default: '' },
    erp_id: { type: String, trim: true, default: '' },
  },
  firstName: { type: String, trim: true, default: '' },
  lastName: { type: String, trim: true, default: '' },
  displayName: { type: String, trim: true },
  phone: { type: String, trim: true, default: '' },
  updated: { type: Date },
  created: { type: Date, default: Date.now },
  staff_id: { type: String, default: '' },
  normalized: {
    username: String,
    displayName: String,
    email: String
  },

  /* For auth */
  username: { type: String, lowercase: true, trim: true },
  email: { type: String, lowercase: true, trim: true, default: '' },
  password: { type: String, default: '' },
  salt: { type: String },
  active: { type: Boolean, default: false },
  loginFailTimes: { type: Number, default: 0 },
  loginFailAt: { type: Date, default: null },
  provider: { type: String },
  is_deleted: { type: Boolean, default: false },

  /* For reset password */
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  /* For roles */
  userType: { type: String, default: 'user_normal' },
  roles: {
    type: [{
      type: Schema.ObjectId
    }]
  },
  in_stores: {
    type: [{
      type: Number
    }],
  },
  in_locations: {
    type: [{
      type: String
    }],
    default: null
  },
  in_provinces: {
    type: [{
      type: String
    }],
    default: null
  },
  in_districts: {
    type: [{
      type: String
    }],
    default: null
  },

  //user shop haravan
  id: { type: String, required: true, unique: true },
  shop: { type: String, default: '', required: true },
  shop_id: { type: Number, default: 0 },
  account: {
    account_owner: { type: Boolean, default: false },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    first_name: { type: String, default: '' },
    id: { type: String, default: '' },
    im: { type: String, default: '' },
    last_name: { type: String, default: '' },
    phone: { type: String, default: '', trim: true },
    receive_announcements: { type: Number, default: 0 },
    url: { type: String, default: '' },
    user_type: { type: String, default: '' },
    permissions: []
  },
  text_search: { type: String, default: '' }
});

// Index
const INDEX_SCHEMA_FILTER_1 = { 'shop_id': 1 };
const INDEX_SCHEMA_FILTER_2 = { 'id': 1 };
const INDEX_SCHEMA_FILTER_3 = { 'userType': 1 };
const INDEX_SCHEMA_FILTER_4 = { 'updated_at': -1 };
const INDEX_SCHEMA_FILTER_5 = { 'email': 1 };
const INDEX_SCHEMA_FILTER_6 = { 'phone': 1 };
const INDEX_SCHEMA_FILTER_7 = { 'text_search': 1 };

UserSchema.index(INDEX_SCHEMA_FILTER_1);
UserSchema.index(INDEX_SCHEMA_FILTER_2);
UserSchema.index(INDEX_SCHEMA_FILTER_3);
UserSchema.index(INDEX_SCHEMA_FILTER_4);
UserSchema.index(INDEX_SCHEMA_FILTER_5);
UserSchema.index(INDEX_SCHEMA_FILTER_6);
UserSchema.index(INDEX_SCHEMA_FILTER_7);

UserSchema.statics.USER_ADMIN = 'user_admin';
UserSchema.statics.USER_NORMAL = 'user_normal';
UserSchema.statics.USER_ONLINE_LEADER = 'user_online_leader';
UserSchema.statics.USER_ONLINE = 'user_online';
UserSchema.statics.USER_ACCOUNTANT = 'user_accountant';
UserSchema.statics.USER_STORE_LEADER = 'user_store_leader';
UserSchema.statics.USER_STORE = 'user_store';
UserSchema.statics.USER_SHIPPER = 'user_shipper';

UserSchema.statics.USER_AUTO_NONE = 0;
UserSchema.statics.USER_AUTO_TOOL = 1;
UserSchema.statics.USER_AUTO_GHN = 3;
UserSchema.statics.USER_AUTO_AHAMOVE = 5;
UserSchema.statics.USER_AUTO_LIST = [
  UserSchema.statics.USER_AUTO_NONE,
  UserSchema.statics.USER_AUTO_TOOL,
  UserSchema.statics.USER_AUTO_GHN,
  UserSchema.statics.USER_AUTO_AHAMOVE,
];

UserSchema.statics.CONFIG_DATA_MODIFY = [
  'shop_id'
];
/**
* @exports UserModel
*/
let exportLists = {
    model: mongoose.model(global.config.prefix_db + 'Users', UserSchema),
    /**
     * @description create date before insert data
     * @param  {object} data
     */
    preInsert: (data) => {
        data.created_at = new Date();
        data.updated_at = null;
        return data;
    },
    
    /**
     * @description update create_at from oldData, create date for 
     * @param  {object} data
     * @param  {object} oldData
     */
    preUpdate: (data, oldData) => {
        data.created_at = oldData.created_at;
        data.updated_at = new Date();
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
    buildQuery: (filter, skip, limit, sort) => {
        let criteria = {};
        let select_field = [];
        //Search equal
        let arrEqual = ['_id', 'id', 'userType', 'shop', 'in_locations', 'shop_id', 'phone', 'active', 'email'];
        criteria = helperBuildQuery.buildCriteriaEqual(arrEqual, filter, criteria);
        //Search between
        let arrBetween = ['created', 'updated'];
        criteria = helperBuildQuery.buildCriteriaBetweenList(arrBetween, filter, criteria);
        //Search like
        criteria = helperBuildQuery.setKeyword(filter, ['text_search'], criteria);
        //Search in array
        let arrIds =  ['ids'];
        criteria = helperBuildQuery.buildFilterInArray(arrIds, filter, criteria);
        //Search User Admin Leader
        if (filter.user_admin_leader){
            let arrUserType = ['userType'];
            let arrTypeAdmin = {'userTypeAdmin': `${UserSchema.statics.USER_ADMIN}, ${UserSchema.statics.USER_ONLINE_LEADER}`};
            criteria = helperBuildQuery.buildFilterInArray(arrUserType, arrTypeAdmin, criteria);
        }
        //Search List User Type
        if (helperObjectArray.filledArray(filter.list_user_type)) {
            let arrUserType = ['userType'];
            criteria = helperBuildQuery.buildFilterInArray(arrUserType, filter.list_user_type, criteria);
        }

        skip = Number(skip);
        limit = Number(limit);

        return { criteria, skip, limit, sort, select_field };
    }
}

module.exports = _.defaults(BaseModel, exportLists);
module.exports.initDefault(exportLists);
