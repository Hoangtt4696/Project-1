/**
 * @author Tran Dinh Hoang
 */

'use strict';

const _                         = require('lodash');
const path                      = require('path');
const BaseBusiness              = require(path.resolve('./core/business/base'));
const VotingGeneralSettingModel = require('../model/voting-general-setting');

module.exports = class UpsertVotingGeneralSettingBusiness extends BaseBusiness {
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
    let [data_update, filter] = this._formatData();
    let updated_setting = await VotingGeneralSettingModel.updated(data_update, filter, null, null, true);
    if (VotingGeneralSettingModel.error) {
      return this._setError(VotingGeneralSettingModel.message);
    }
    return updated_setting;
  }

  _validate() {
    if (!_.isObjectLike(this._user)) {
      this._setError('Tài khoản không hợp lệ');
    }
    if (!_.isObjectLike(this._data) || _.size(this._data) <= 0) {
      this._setError('Dữ liệu không hợp lệ');
    }

    if ( this._data.hasOwnProperty('manager_voting_open_at') && (
         !_.isObjectLike(this._data.manager_voting_open_at) 
      || !isBetween(this._data.manager_voting_open_at.day, 1, 31)
      || !isBetween(this._data.manager_voting_open_at.hour, 0, 23)
      || !isBetween(this._data.manager_voting_open_at.minute, 0, 59)
    )){
      this._setError('Thời gian bắt đầu vòng bình chọn của quản lý không hợp lệ');
    }

    if ( this._data.hasOwnProperty('manager_voting_close_at') && (
       !_.isObjectLike(this._data.manager_voting_close_at) 
    || !isBetween(this._data.manager_voting_close_at.day, 1, 31)
    || !isBetween(this._data.manager_voting_close_at.hour, 0, 23)
    || !isBetween(this._data.manager_voting_close_at.minute, 0, 59)
    )){
      this._setError('Thời gian kết thúc vòng bình chọn của quản lý không hợp lệ');
    }

    if ( this._data.hasOwnProperty('employee_voting_open_at') && (
       !_.isObjectLike(this._data.employee_voting_open_at) 
    || !isBetween(this._data.employee_voting_open_at.day, 1, 31)
    || !isBetween(this._data.employee_voting_open_at.hour, 0, 23)
    || !isBetween(this._data.employee_voting_open_at.minute, 0, 59)
    )){
      this._setError('Thời gian băt đầu vòng bình chọn của nhân viên không hợp lệ');
    }

    if ( this._data.hasOwnProperty('employee_voting_close_at') && (
       !_.isObjectLike(this._data.employee_voting_close_at) 
    || !isBetween(this._data.employee_voting_close_at.day, 1, 31)
    || !isBetween(this._data.employee_voting_close_at.hour, 0, 23)
    || !isBetween(this._data.employee_voting_close_at.minute, 0, 59)
    )){
      this._setError('Thời gian kết thúc vòng bình chọn của nhân viên không hợp lệ');
    }

    if (!this.error) {
      let manager_voting_open_time =    
      this._data.manager_voting_open_at.day   * 24 +
      this._data.manager_voting_open_at.hour  * 60 +
      this._data.manager_voting_open_at.minute;

      let manager_voting_close_time =    
      this._data.manager_voting_close_at.day   * 24 +
      this._data.manager_voting_close_at.hour  * 60 +
      this._data.manager_voting_close_at.minute;
      
      if (manager_voting_open_time >= manager_voting_close_time) {
        this._setError('Thời gian mở vòng bình chọn của quản lý phải nhỏ hơn thời gian kết thúc');
      }

      let employee_voting_open_time =    
      this._data.employee_voting_open_at.day   * 24 +
      this._data.employee_voting_open_at.hour  * 60 +
      this._data.employee_voting_open_at.minute;

      let employee_voting_close_time =    
      this._data.employee_voting_close_at.day   * 24 +
      this._data.employee_voting_close_at.hour  * 60 +
      this._data.employee_voting_close_at.minute;
      
      if (employee_voting_open_time >= employee_voting_close_time) {
        this._setError('Thời gian mở vòng bình chọn của nhân viên phải nhỏ hơn thời gian kết thúc');
      }
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
function isBetween(val, min, max) {
  return val >= min && val <= max;
}