/**
 * @author Tran Dinh Hoang
 */

'use strict';

const _                            = require('lodash');
const path                         = require('path');
const helperClass                  = require(path.resolve('./helper/class'))
const BaseController               = require(path.resolve('./core/controller/base'));
const UpsertGeneralSettingBusiness = require('../business/upsert-voting-general-setting');
const UpsertLimitSettingBusiness   = require('../business/upsert-voting-limit-setting');
const VotingGeneralSettingModel    = require('../model/voting-general-setting');
const VotingLimitSettingModel      = require('../model/voting-limit-setting');

class VotingController extends BaseController {
  constructor(req, res, next) {
    super(req, res, next);
  }

  async upsertGeneralSetting() {
    let bus = new UpsertGeneralSettingBusiness(this._user, this._body);
    let setting = await bus.upsert();
    if (bus.error) {
      return this.renderError(bus.message);
    }
    return this.renderJson(setting);
  }

  async getGeneralSetting() {
    let general_setting = await VotingGeneralSettingModel.selectOne({ orgid : this._user.orgid });
    if (VotingGeneralSettingModel.error) {
      return this.renderError(VotingGeneralSettingModel.message);
    }
    else if (!_.isObjectLike(general_setting)) {
      return this.renderError('Chưa thiết lập cấu hình');
    }
    return this.renderJson(general_setting);
  }

  async upsertLimitSetting() {
    let bus = new UpsertLimitSettingBusiness(this._user, this._body);
    let setting = await bus.upsert();
    if (bus.error) {
      return this.renderError(bus.message);
    }
    return this.renderJson(setting);
  }

  async getLimitSetting() {
    let limit_setting = await VotingLimitSettingModel.selectOne({ orgid : this._user.orgid });
    if (VotingLimitSettingModel.error) {
      return this.renderError(VotingLimitSettingModel.message);
    }
    else if (!_.isObjectLike(limit_setting)) {
      return this.renderError('Chưa thiết lập cấu hình');
    }
    return this.renderJson(limit_setting);
  }

}

module.exports = helperClass.exportClassMethod(VotingController, [
  'upsertGeneralSetting',
  'getGeneralSetting',

  'upsertLimitSetting',
  'getLimitSetting'
]);