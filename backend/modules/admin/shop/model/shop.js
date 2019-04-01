'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var path = require('path');
var _ = require('lodash');
let BaseModel = require(path.resolve('./core/model/mongo/base.js'));
let helperBuildQuery = require(path.resolve('./helper/build-query.js'));
var Schema = mongoose.Schema;

var ShopSchema = new Schema({
  url: { type: String, required: true, unique: true },
  id: { type: Number, required: true, unique: true },
  authorize: {
    access_token: { type: String, default: '' },
    refresh_token: { type: String, default: '' },
    expires_in: { type: Number, default: 0 }
  },
  status: { type: Number, default: 0 },
  company_id: { type: String, default: "" },
  org_code: { type: String, default: "" },
  org_name: { type: String, default: "" },
  locator_id: { type: Number, default: 0 },
  store_id: { type: Number, default: 0 },
  locator_code: { type: String, default: "" },
  store_code: { type: String, default: "" },
  haravan_settings: { type: Schema.Types.Mixed },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null }
});
/**
* @exports ShopModel
*/
let exportLists = {
  model: mongoose.model(global.config.prefix_db + 'Shop', ShopSchema),
  /**
  * xử lý trước khi insert
  * @param  {object} data
  * @returns {object} new Data
  */
  buildQuery: (filter, skip, limit, sort) => {
    let criteria = {};
    let select_field = [];

    let arrEqual = ['_id', 'shop_id'];
    criteria = helperBuildQuery.buildCriteriaEqual(arrEqual, filter, criteria);

    /*gte_*  and lte_* tim kiem trong khoang (cung co the tim lon hon hoac be hon)*/
    let arrBetween = ["created_at"];
    criteria = helperBuildQuery.buildCriteriaBetweenList(arrBetween, filter, criteria);

    /*Search like (gia tri dua vao key keyword)*/
    criteria = helperBuildQuery.setKeyword(filter, ['other_reason'], criteria);

    skip = Number(skip);
    limit = Number(limit);

    return { criteria, skip, limit, sort, select_field };
  },

  /**
   * xử lý dữ liệu cho aggregate
   * @param  {object} filter
   * @param  {number} skip
   * @param  {number} limit
   * @param  {object} sort
   * @description  format [{match: {}}, {group: {}}, {match: {}}]
   */
  buildAggregate: (filter, skip, limit, sort) => {
    return [{ match: {} }, { group: {} }, { match: {} }];
  },
  /**
   * xử lý data upsert
   * @param  {object} data
   */
  preInsert: (data) => {
    data.created_at = new Date();
    data.updated_at = null;
    return data;
  },
  /**
   * xử lý data upsert
   * @param  {object} data
   */
  preUpsert: (data) => {
    return data;
  },
  /**
   * xử lý data preUpdate
   * @param  {object} data dũ liệu mới
   * @param  {object} oldData dũ liệu hiện có
   */
  preUpdate: (data, oldData) => {
    data.created_at = oldData.created_at;
    data.updated_at = new Date();
    return data;
  },
}

module.exports = exportLists;
/* Alway call */
let objBaseModel = new BaseModel(exportLists);
module.exports = _.defaults(objBaseModel, module.exports);



