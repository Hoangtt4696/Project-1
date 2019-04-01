'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    Schema = mongoose.Schema;
var hintPlugin = require('mongoose-hint');
let BaseModel = require(path.resolve('./core/model/mongo/base.js'));
let helperBuildQuery = require(path.resolve('./helper/build-query.js'));
//let helperObjectArray = require(path.resolve('./helper/object-array.js'));
/**
 * Locations Schema
 */
var LocationsSchema = new Schema({
    id: { type: Number, default: 0},
    shop_id: {type: Number, default: 0},
    name: { type: String, default: '' },
    email: { type: String, default: null },
    location_type: { type: String, default: null },
    address1: { type: String, default: null },
    address2: { type: String, default: null },
    zip: { type: String, default: null },
    city: { type: String, default: null },
    country: { type: String, default: 'Vietnam' },
    province: {type: String, default: null},
    province_code: {type: String, default: null },
    district: {type: String, default: null},
    district_code: {type: String, default: null },
    ward : {type: String, default: null},
    ward_code : {type: String, default: null},
    phone: { type: String, default: null },
    country_code: { type: String, default: null },
    country_name: { type: String, default: 'Vietnam' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: String, default: null },
    code_location: { type: String, default: null },
    shipping_zone_district: { type: [], default: [] },
    shipping_zone_province: { type: [], default: [] },
    shop: { type: String, default: '' },
    is_deleted: {type: Boolean, default: false},
    full_text_search: { type: String, default: ''},
    not_location_web: { type: Boolean, default: false },
    not_location_stock: { type: Boolean, default: false },
    has_store: { type: Number, default: 0 },
    store_id: { type: Number, default: 0 }, // cửa hàng
    store_location_type: { type: Number, default: 0 }, //loại kho (3 loai)
    erp_code: { type: String, default: ''}
});

LocationsSchema.statics.CONFIG_DATA_MODIFY = ['shop_id'];
LocationsSchema.statics.HAS_STORE_TRUE = 1;
LocationsSchema.statics.HAS_STORE_FALSE = 0;

const INDEX_SCHEMA_FILTER_1 = { 'shop': 1, 'created_at': 1};
const INDEX_SCHEMA_FILTER_2 = { 'shop': 1, 'full_text_search': 1, 'created_at': 1};
const INDEX_SCHEMA_FILTER_3 = { 'shop': 1, 'province_code': 1, 'district_code': 1, 'created_at': 1};
LocationsSchema.index(INDEX_SCHEMA_FILTER_1);
LocationsSchema.index(INDEX_SCHEMA_FILTER_2);
LocationsSchema.index(INDEX_SCHEMA_FILTER_3);

// set the plugin with the hints to use, in order of priority
LocationsSchema.plugin(hintPlugin.find, [
    INDEX_SCHEMA_FILTER_1,
    INDEX_SCHEMA_FILTER_2,
    INDEX_SCHEMA_FILTER_3
  ]);

LocationsSchema.statics.STORE_LOCATION_TYPE_SALE = 1; // kho bán
LocationsSchema.statics.STORE_LOCATION_TYPE_TRANSPORT = 2; // kho đi đường
LocationsSchema.statics.STORE_LOCATION_TYPE_DEFECTIVE = 3; // kho lỗi
LocationsSchema.statics.STORE_LOCATION_TYPE_WAIT_HANDLE = 4; // kho chờ xử lý

LocationsSchema.statics.LIST_STORE_LOCATION_TYPE = [
    LocationsSchema.statics.STORE_LOCATION_TYPE_SALE,
    LocationsSchema.statics.STORE_LOCATION_TYPE_TRANSPORT,
    LocationsSchema.statics.STORE_LOCATION_TYPE_DEFECTIVE,
    LocationsSchema.statics.STORE_LOCATION_TYPE_WAIT_HANDLE
];

/**
* @exports LocationModel
*/
let exportLists = {
    model: mongoose.model(global.config.prefix_db + 'Location', LocationsSchema),
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
     * @description update create_at from oldData, create date for field updated
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
     * @description processed data before insert
     * @param  {object} filter
     * @param  {number} skip
     * @param  {number} limit
     * @param  {number} sort
     */
    buildQuery: (filter, skip, limit, sort) => {
        let criteria = {};
        let select_field = [];
        //Search equal
        let arrEqual = ['id', 'shop_id', 'erp_code'];
        criteria = helperBuildQuery.buildCriteriaEqual(arrEqual, filter, criteria);
        //Search in array
        let objFilter = {'id': 'location_in', 'store_id': 'stores_in'};
        criteria = helperBuildQuery.buildFilterInArray(objFilter, filter, criteria);
        let objFilterStoreIds = {'store_id': 'list_store_id'};
        criteria = helperBuildQuery.buildFilterInArray(objFilterStoreIds, filter, criteria);

        skip = Number(skip);
        limit = Number(limit);

        return { criteria, skip, limit, sort, select_field };
    }
}

module.exports = exportLists;
/* Alway call */
let objBaseModel = new BaseModel(exportLists);
module.exports = _.defaults(objBaseModel, module.exports);