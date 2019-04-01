/**
 * @author Tran Dinh Hoang
 */

'use strict';

const _                         = require('lodash');
const path                      = require('path');
const BaseBusiness              = require(path.resolve('./core/business/base'));
const VotingLimitSettingModel   = require('../model/voting-limit-setting');

module.exports = class UpsertVotingLimitSettingBusiness extends BaseBusiness {
  constructor(user, data) {
    super();
    this._user = user;
    this._data = data;
  }

  async upsert() {
    this._validate();
    if (this.error) {
      return;
    }
    let [data_create, filter] = this._formatData();
    let updated_setting = await VotingLimitSettingModel.updated(data_create, filter, null, null, true);
    if (VotingLimitSettingModel.error) {
      return this._setError(VotingLimitSettingModel.message);
    }
    return updated_setting;
  }

  _validate() {
    if (!_.isObjectLike(this._user)) {
      this._setError('Tài khoản không hợp lệ');
    }
    if (!_.isObjectLike(this._data)) {
      this._setError('Dữ liệu không hợp lệ');
    }

    // voting limit
    if ( !_.isObjectLike(this._data.voting_limit)
      // || !isBetween(_.get(this._data.voting_limit, '1.limit'), 0, 100)
      // || !isBetween(_.get(this._data.voting_limit, '2.limit'), 0, 100)
      // || !isBetween(_.get(this._data.voting_limit, '3.limit'), 0, 100)
      || !VotingLimitSettingModel.ROUND_METHOD_LIST.includes(this._data.voting_limit['1'].round_method)
      || !VotingLimitSettingModel.ROUND_METHOD_LIST.includes(this._data.voting_limit['2'].round_method)
      || !VotingLimitSettingModel.ROUND_METHOD_LIST.includes(this._data.voting_limit['3'].round_method)

      || (Number(_.get(this._data.voting_limit, '1.limit')) + Number(_.get(this._data.voting_limit, '2.limit')) + Number(_.get(this._data.voting_limit, '3.limit'))) > 100
    ){
      this._setError('Hạn mức bình chọn không hợp lệ');
    }

    // exchange mark
    if ( !_.isObjectLike(this._data.exchange_mark)
      || !isBetween(_.get(this._data.exchange_mark, '1.value'), 0)
      || !isBetween(_.get(this._data.exchange_mark, '2.value'), 0)
      || !isBetween(_.get(this._data.exchange_mark, '3.value'), 0)

      || !VotingLimitSettingModel.ROUND_METHOD_LIST.includes(this._data.exchange_mark['1'].round_method)
      || !VotingLimitSettingModel.ROUND_METHOD_LIST.includes(this._data.exchange_mark['2'].round_method)
      || !VotingLimitSettingModel.ROUND_METHOD_LIST.includes(this._data.exchange_mark['3'].round_method)
    ){
      this._setError('Quy đổi điểm không hợp lệ');
    }
  }

  _formatData() {
    let data        = this._data;
    data.user_id    = this._user.id;
    data.orgid      = this._user.orgid;
    data.updated_at = new Date();

    let filter = {
      orgid   : this._user.orgid
    };
    return [data, filter];
  }
}

//////////// UTILITIES ///////////////
function isBetween(val, min) {
  return typeof val === 'number' && val >= min;
}