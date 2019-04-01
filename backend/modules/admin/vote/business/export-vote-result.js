/**
 * @author Tran Dinh Hoang
 */

'use strict';

const _                         = require('lodash');
const path                      = require('path');
const uuidV4                    = require('uuid/v4');
const BaseBusiness              = require(path.resolve('./core/business/base'));
const ModelVote                 = require('../model/vote');
const ModelVotingLimitSetting   = require('../../vote-setting/model/voting-limit-setting');
const handle                    = require(path.resolve('./helper/handle'));
const exportExcel               = require(path.resolve('./helper/export-excel'));
const buildLink                 = require(path.resolve('./helper/build-link'));
const Email                     = require(path.resolve('./lib/email/hrvemail.server.api'));

const BALLET_NAME = {
  1 : 'A',
  2 : 'B',
  3 : 'C',
};

module.exports = class ExportVoteResultBusiness extends BaseBusiness {
  constructor(user, options) {
    super();
    this._user    = user;
    this._options = options;
  }

  /**
   * @description
   * ```
   * Validate
   * Fetch vote limit setting
   * Fetch all votes with options, sort by vote time increase
   * For each vote, do : 
   *    Generate excel data :
   *      Calculate votee point
   * Write excel file
   * Send email to user
   * ```
   */
  async start() {
    try {
      await this._validate();
      let [voteLimitSetting, votes] = await Promise.all([this._getVoteLimitSetting(), this._fetchVotes()]);
      this._export(voteLimitSetting, votes);
      return { error : false, send_mail : true, message : [] };
    }
    catch (err) {
      return this._setError(handle(err));
    }
  }

  async _export(voteLimitSetting, votes) {
    try {
      let excelData;
      try {
        excelData = await this._generateExcelData(voteLimitSetting, votes);
        // console.table(excelData.rows);
      }
      catch (err) {
        let message = handle(err);
        excelData = { error : ` : ${message}` };
      }
      let downloadLink = await this._writeFile(excelData);
      await this._sendMail(downloadLink);
    }
    catch (err) {
      handle(err);
    }
  }

  async _validate() {
    if (!_.isObjectLike(this._user)) {
      throw new Error('[ERR_CLIENT] Tài khoản không hợp lệ');
    }
  }
  
  async _getVoteLimitSetting() {
    let filter = { orgid: this._user.orgid };
    let voteLimitSetting = await ModelVotingLimitSetting.selectOne(filter);
    if (!_.isObjectLike(voteLimitSetting)) {
      throw new Error(`[ERR_DB] Can't find vote limit setting with filter = ${JSON.stringify(filter)} : ${ModelVotingLimitSetting.message}`);
    }
    return voteLimitSetting;
  }

  async _fetchVotes() {
    let filter = _.get(this._options, 'filter', {});
    delete filter.skip;
    delete filter.limit;
    filter.lean = true;

    let votes = await ModelVote.select(filter);
    if (ModelVote.error) {
      throw new Error(`[ERR_DB] Can't find votes with filter = ${JSON.stringify(filter)} : ${ModelVote.message}`);
    }
    if (_.size(votes) <= 0) {
      throw new Error('[ERR_CLIENT] Không có dữ liệu');
    }
    return votes;
  }

  async _generateExcelData(voteLimitSetting, votes) {
    let mark_unit = voteLimitSetting.exchange_mark_type === ModelVotingLimitSetting.EXCHANGE_MARK_TYPE_FIXED ? 'đ' : '%';

    let excel_data = {
      A_mark : _.get(voteLimitSetting, 'exchange_mark.1.value', 0) + mark_unit,
      B_mark : _.get(voteLimitSetting, 'exchange_mark.2.value', 0) + mark_unit,
      C_mark : _.get(voteLimitSetting, 'exchange_mark.3.value', 0) + mark_unit,
      rows   : [],
    };

    votes.forEach(vote => {
      vote.department_id_total_votee = this.calculateTotalVoteeOfDepartment(vote);
      let rows = this._generateRows(voteLimitSetting, vote);
      excel_data.rows = excel_data.rows.concat(rows);
    });

    return excel_data;
  }

  calculateTotalVoteeOfDepartment(vote) {
    let department_id_total_votee = {};
    _.forEach(vote.department, department_id => {
      department_id_total_votee[department_id] = 0;
      _.forEach(vote.employee_list, (votee => {
        if (votee.join && votee.employee_department_vote === department_id) {
          department_id_total_votee[department_id]++;
        }
      }));
    });
    return department_id_total_votee;
  }

  /**
   * @return rows
   * @example
   * [{
   *  rows_month               : Date,
   *  employee_userId          : 'VLX00021',
   *  employee_name            : 'Ngô Ngọc Hải',
   *  employee_job_title       : 'Team Leader',
   *  employee_department_name : 'HR DevTeam',
   *  A_count                  : 1,
   *  B_count                  : 1,
   *  C_count                  : 2,
   *  A_mark                   : 3,
   *  B_mark                   : 2,
   *  C_mark                   : 2,
   *  mark_avg                 : 2.3,
   *  mark_bonus               : 2,
   * }]
   */
  _generateRows(voteLimitSetting, vote) {
    let rows         = [];

    _.forEach(vote.employee_list, votee => {
      let ballet_count = votee.point_type;
      let votee_count  = vote.department_id_total_votee[votee.employee_department_vote];

      if (!votee.join || !votee_count) {
        return;
      }
      let [ballet_mark, mark_avg, mark_bonus] = this._calculateMark(voteLimitSetting, votee_count, ballet_count);
      let row = {
        rows_month               : this._calculateDate(vote.year_month_vote),
        employee_userId          : votee.employee_userId,
        employee_name            : votee.employee_name,
        employee_department_name : votee.employee_department_name,
        employee_job_title       : votee.employee_job_title,
        mark_avg                 : mark_avg,
        mark_bonus               : mark_bonus,
      };

      for (let ballet in ballet_count) {
        let ballet_name = BALLET_NAME[ballet];
        row[`${ballet_name}_count`] = ballet_count[ballet];
      }

      for (let ballet in ballet_mark) {
        let ballet_name = BALLET_NAME[ballet];
        row[`${ballet_name}_mark`] = ballet_mark[ballet];
      }

      rows.push(row);
    });
    
    return rows;
  }

  _calculateDate(month_year) {
    let month = parseInt(month_year % 100);
    let year  = parseInt(month_year / 100);
    return new Date(year, month);
  }

  _calculateMark(voteLimitSetting, votee_count, ballet_count) {
    let ballet_mark   = { 1 : 0, 2 : 0, 3 : 0 };
    let mark_avg      = 0;
    let mark_bonus    = 0;
    let exchange_type = voteLimitSetting.exchange_mark_type;
    let exchange_mark = voteLimitSetting.exchange_mark;

    for (let ballet in ballet_count) {
      let count = ballet_count[ballet];
      if (exchange_type === ModelVotingLimitSetting.EXCHANGE_MARK_TYPE_FIXED) {
        ballet_mark[ballet] = count * exchange_mark[ballet].value;
      }
      if (exchange_type === ModelVotingLimitSetting.EXCHANGE_MARK_TYPE_RATIO) {
        let mark = count * exchange_mark[ballet].value;
        let round_method = exchange_mark[ballet].round_method;
        mark = (mark * votee_count) / 100;
        mark = ModelVotingLimitSetting.ROUND_METHOD[round_method](mark);
        ballet_mark[ballet] = mark;
      }
    }

    mark_avg   = _.size(ballet_mark) > 0 ? _.sum(_.values(ballet_mark)) / _.size(ballet_mark) : 0;
    mark_bonus = Math.round(mark_avg);
        
    return [ballet_mark, mark_avg, mark_bonus];
  }

  async _writeFile(excelData) {
    let templateFile = path.resolve('./modules/admin/vote/templates/export-vote-result.xlsx');
    let outputFile   = `export-vote-result-${uuidV4()}.xlsx`;
    let downloadLink = buildLink.ExportFileURL(outputFile);
    let exportError  = await exportExcel(excelData, templateFile, outputFile);
    if (exportError) {
      exportError.message += `[ERR_SERVICE] Có lỗi xảy ra khi xuất file, chi tiết : ${exportError.message}`;
      throw exportError;
    }
    return downloadLink;
  }

  async _sendMail(downloadLink) {
    var emailTemplate = path.resolve('./lib/email/templates/export_complete.html');
    let dataInfo = {
      user          : this._user,
      subjectType   : 'Xuất file danh sách kết quả bình chọn',
      downloadLink  : downloadLink,
    };
    await Email.sendEmailWithTemplate(dataInfo, emailTemplate);
  }
}