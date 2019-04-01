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

const VotingLimitSettingSchema = new Schema({
  orgid   : { type: String, default: 0, require : true, unique : true },
  user_id : { type: String, default: 0 },

  voting_limit : {
    1 : {
      limit        : { type : String, default : 0 },
      round_method : { type : String, default : 'ROUND' }
    }, 
    2 : {
      limit        : { type : String, default : 0 },
      round_method : { type : String, default : 'ROUND' }
    },
    3 : {
      limit        : { type : String, default : 0 },
      round_method : { type : String, default : 'ROUND' }
    }
  },

  only_limit_ballot_A : { type: Boolean, default: false },

  exchange_mark_type : { type : String, default : 'FIXED' },
  exchange_mark : {
    1 : {
      value        : { type : Number, default : 0 },
      round_method : { type : String, default : 'ROUND' }
    }, 
    2 : {
      value        : { type : Number, default : 0 },
      round_method : { type : String, default : 'ROUND' }
    },
    3 : {
      value        : { type : Number, default : 0 },
      round_method : { type : String, default : 'ROUND' }
    }
  },
  
  created_at : { type : Date, default : Date.now },
  updated_at : { type : Date, default : null },
});


const INDEX_SCHEMA_FILTER_1 = {'org_id': 1};
const INDEX_SCHEMA_FILTER_2 = {'user_id': 1};

// set the plugin with the hints to use, in order of priority
VotingLimitSettingSchema.plugin(hintPlugin.find, [
  INDEX_SCHEMA_FILTER_1,
  INDEX_SCHEMA_FILTER_2,
]);

VotingLimitSettingSchema.index(INDEX_SCHEMA_FILTER_1);
VotingLimitSettingSchema.index(INDEX_SCHEMA_FILTER_2);

let exportLists = {
  model     : mongoose.model(global.config.prefix_db + 'Voting_limit_setting', VotingLimitSettingSchema),
  //--------------------- constants -------------------
  ROUND_METHOD_LIST : ['ROUND', 'CEIL', 'FLOOR'],
  ROUND_METHOD      : {
    ROUND : Math.round,
    CEIL  : Math.ceil,
    FLOOR : Math.floor
  },
  EXCHANGE_MARK_TYPE_LIST  : ['FIXED', 'RATIO'],
  EXCHANGE_MARK_TYPE_FIXED :'FIXED',
  EXCHANGE_MARK_TYPE_RATIO :'RATIO',

  //-------------------- statics method ----------------

  //--------------------- middleware ------------------
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
