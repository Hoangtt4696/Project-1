'use strict';

const path              = require('path');
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const _                 = require('lodash');
const BaseModel         = require(path.resolve('./core/model/mongo/base.js'));
const helperBuildQuery  = require(path.resolve('./helper/build-query.js'));

var VotePointSchema = new Schema({
    vote_id : { type: String, default: '', required: true },
    department_id: { type: Number, default: 0 },
    voter_id: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at : { type : Date, default : null },
    employee_point_list: [{
        _id: false,
        employee_id: { type: Number, default: 0},
        point_level: { type: Number, default: 0},
    }],
});

const INDEX_SCHEMA_FILTER_1 = {'vote_id' : 1};
const INDEX_SCHEMA_FILTER_2 = {'voter_id': 1};
const INDEX_SCHEMA_FILTER_3 = {'department_id': 1};

VotePointSchema.index(INDEX_SCHEMA_FILTER_1);
VotePointSchema.index(INDEX_SCHEMA_FILTER_2);
VotePointSchema.index(INDEX_SCHEMA_FILTER_3);

/**
* @exports  VotePointModel
*/
let exportLists = {
    model: mongoose.model(global.config.prefix_db + 'Vote_point', VotePointSchema),

    /**
   * @description create date
   * @param  {object} data
   */
    preInsert: (data) => {
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
        let arrEqual = ['_id', 'vote_id', 'voter_id', 'department_id'];
        criteria = helperBuildQuery.buildFilterEqual(arrEqual, filter, criteria);
        //Search between
        let arrBetween = ['created_at'];
        criteria = helperBuildQuery.buildFilterBetweenList(arrBetween, filter, criteria);

        return criteria;
    },
    error     : false,
    message   : [],

};

module.exports = _.defaults(new BaseModel(exportLists), exportLists);