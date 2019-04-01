'use strict';

const path = require('path');
const BaseController = require(path.resolve('./core/controller/base'));
const helperClass = require(path.resolve('./helper/class'));
const ModelVote = require('../model/vote');
const BusinessVote = require('../business/vote');
const callAPI = require(path.resolve('./helper/call-api'));
const _ = require('lodash');
const moment = require('moment');
const ModelVotingGeneralSetting   = require('../../vote-setting/model/voting-general-setting');
const ModelVotingLimitSetting   = require('../../vote-setting/model/voting-limit-setting');
const BusinessExportVoteResult= require(path.resolve('./modules/admin/vote/business/export-vote-result'));
const rabbitQueue = require(path.resolve('./lib/rabbit/queue.js'));

class VoteController extends BaseController {
    constructor(req, res, next, id) {
        super(req, res, next, id);
    }
    /**
     * @description create vote
     */
    async create() {
        let bus = new BusinessVote(this._user, this._body);
        await bus._validate();
        if (bus.error) {
            return this.renderError(bus.message);
        }

        let dataVote = {
            data: this._body,
            user: this._user
        };

        try {
            rabbitQueue(dataVote, 'sync_create_vote');
        } catch (error) {
            this.renderError(error);
        }
        
        let strNotification = 'Hệ thống đang xử lý. Tiến trình sẽ mất vài phút để hoàn tất. Vui lòng kiểm tra email để cập nhật kết quả xử lý.';
        return this.renderJson(strNotification);
    }
    /**
     * @description update vote
     */
    async update() {
        let bus = new BusinessVote(this._user, this._body, this._model, this._req);
        let vote = await bus.update();
        if (bus.error) {
            return this.renderError(bus.message, 422, { id: this._model._id });
        }
        return this.renderJson(vote);
    }

    /**
     * @description update vote
     */
    async activate() {
        let bus = new BusinessVote(this._user, this._body, this._model, this._req);
        let vote = await bus.active();
        if (bus.error) {
            return this.renderError(bus.message, 422, {id: this._model._id});
        }
        return this.renderJson(vote);
    }

    /**
     * @description update vote
     */
    async deactivate() {
        let bus = new BusinessVote(this._user, this._body, this._model, this._req);
        let vote = await bus.deactivate();
        if (bus.error) {
            return this.renderError(bus.message, 422, {id: this._model._id});
        }
        return this.renderJson(vote);
    }

    /**
     * @description delete vote
     */
    async delete() {
        await ModelVote.deleted({ _id: this._model._id });
        if (ModelVote.error) {
            return this.renderError(ModelVote.message);
        }
        return this.renderJson();
    }
    /**
     * @description get all vote
     */
    async list() {
        let filter = this._filter;
        if (this._user.role !== 'admin') {
            filter.employee_id = this._user.employee_id;
        }

        let countVote = await ModelVote.count(filter);
        let votes = await ModelVote.select(filter);
        if (ModelVote.error) {
            return this.renderError(ModelVote.message);
        }
        return this.renderJson({
            total: countVote,
            limit: this._limit,
            page: this._page,
            items: votes
        });
    }
    /**
     * @description get detail vote
     * @param  {} next
     * @param  {} id
     */
    async detail() {
        return await this.getDetail();
    }
    /**
     */
    async detailVoteById() {
        await this.midlewareGetDetailByID(ModelVote)
    }

    async submitResult() {
        let strSuccess = {
            id: _.get(this._req, 'params.id'),
            status: 200,
            message: ''
        };
        let vote = await ModelVote.selectOne({_id: _.get(this._req, 'params.id')});
        let timeFrom = vote.time_vote_employee.from;
        let lstEmployee = vote.employee_list;
        let lstDepartment = vote.department_active;
        //Get setting salary
        let voteSetting = await ModelVotingGeneralSetting.selectOne({orgid: this._user.orgid});
        let salaryEmpployee = voteSetting.employee_salary_element;
        let salaryDepartment = voteSetting.department_salary_element;
        //Call API reset point
        let resultResetPoint = await this._resetAllPointOfEmployee(lstEmployee, salaryEmpployee, salaryDepartment);
        if (!resultResetPoint) {
            return this.renderError('Đã có lỗi xảy ra khi gửi kết quả. Vui lòng thử lại', 422, {id: strSuccess.id});
        }
        //Call API send point
        let resultSendPoint = await this._sendAllPointOfEmployees(timeFrom, lstEmployee, lstDepartment, salaryEmpployee, salaryDepartment);
        if (!resultSendPoint) {
            return this.renderError('Đã có lỗi xảy ra khi gửi kết quả. Vui lòng thử lại', 422, {id: strSuccess.id});
        }

        if (resultResetPoint && resultSendPoint) {
            strSuccess.message = 'Gửi kết quả thành công';
        }

        return this.renderJson(strSuccess);
    }

    async _sendAllPointOfEmployees(timeStartVote, lstEmployee, lstDepartment, salaryEmpployee, salaryDepartment) {
        let date = moment(timeStartVote).format('YYYY-MM-DD');
        let employeeSalaryCode   = salaryEmpployee.code;
        let employeeAuthCode     = salaryEmpployee.authenticateCode;
        let departmentSalaryCode = salaryDepartment.code;
        let departmentAuthCode   = salaryDepartment.authenticateCode;
        //Get setting voting limit 
        let voteSetting = await ModelVotingLimitSetting.selectOne({orgid: this._user.orgid});
        let voteExchangeMark = voteSetting.exchange_mark;
        let exchangeMarkType = voteSetting.exchange_mark_type;

        let employeesByDepartment = {};
        // Group employee by department
        for (let i = 0; i < lstDepartment.length; i++) {
            const department = lstDepartment[i];
            employeesByDepartment[department] = [];
            let filterEmployee = lstEmployee.filter((el) => {
                return el.employee_department_vote === department && el.join === true;
            });
            employeesByDepartment[department].push(...filterEmployee);
        }
        //With each department send point of employee, send total point of each department
        for (let key in employeesByDepartment) {
            let items = employeesByDepartment[key];
            let totalDepartment = this._pointToTalForDepartment(items, voteExchangeMark, exchangeMarkType);

            await Promise.all(items.map(async employee => {
                let pointType = _.get(employee, '_doc.point_type', {});
                let totalEmployee = this._pointToTalForEmployee(pointType, voteExchangeMark, exchangeMarkType, items.length);
                let datas = {
                    haraId: employee.haraId,
                    employeeId: employee.employee_id,
                    salaryDay: date,
                    total: totalEmployee,
                    elementCode: employeeSalaryCode,
                    authenticateCode: employeeAuthCode
                };
                //send point of employee
                let resultEmployee = await this._sendPoint(datas);
                if (!resultEmployee) {
                    return this.renderError('Đã có lỗi xảy ra khi gửi kết quả. Vui lòng thử lại');
                }
                //Send point of department
                datas.total = totalDepartment;
                datas.elementCode = departmentSalaryCode;
                datas.authenticateCode = departmentAuthCode;
                let resultDepartment = await this._sendPoint(datas);
                if (!resultDepartment) {
                    return this.renderError('Đã có lỗi xảy ra khi gửi kết quả. Vui lòng thử lại');
                }
            }, this));
        }

        return true;
    }
    
    async _resetAllPointOfEmployee(lstReset, salaryEmpployee, salaryDepartment) {
        let dateNow = moment().format('YYYY-MM-DD');
        let params = {
            day: dateNow
        }
        for (let i = 0; i < lstReset.length; i++) {
            const element = lstReset[i];
            //reset point for employee
            params.elementCode = salaryEmpployee.code;
            params.authenticationCode = salaryEmpployee.authenticateCode;
            params.employeeId = element.employee_id;
            params.haraId = element.employee_haraId;
            await this._resetPoint(params);
            // reset point for department
            params.elementCode = salaryDepartment.code;
            params.authenticationCode = salaryDepartment.authenticateCode;
            params.employeeId = element.employee_id;
            params.haraId = element.employee_haraId;
            await this._resetPoint(params);
        }

        return true;
    }

    async _resetPoint(params) {
        let [err, res] = await callAPI(callAPI.HR_SALARY_DATA_RESET_POINT, params, this._user);
        if (err) {
            return this.renderError(err.message);
        }
        let items = _.get(res, 'data', []);

        return items;
    }
    
    async _sendPoint(data) {
        let [err, res] = await callAPI(callAPI.HR_ADD_SALARY_DATA, data, this._user);
        if (err) {
            return this.renderError(err.message);
        }
        let items = _.get(res, 'data', []);

        return items;
    }

    async exportVoteResults() {
        let filter = { orgid : this._user.orgid, ...this._filter };
        let bus = new BusinessExportVoteResult(this._user, { filter : filter });
        let result = await bus.start();
        if (bus.error) {
            return this.renderError(bus.message);
        }
        return this.renderJson(result);
    }

    async exportVoteResult() {
        let filter = { _id : this._model._id, orgid : this._user.orgid };
        let bus = new BusinessExportVoteResult(this._user, { filter : filter });
        let result = await bus.start();
        if (bus.error) {
            return this.renderError(bus.message);
        }
        return this.renderJson(result);
    }
    //Sum point total employee of department
    _pointToTalForDepartment(lstEmployee, voteExchangeMark, exchangeMarkType) {
        let total = 0;
        for (let i = 0; i < lstEmployee.length; i++) {
            const employee = lstEmployee[i];
            let pointType = _.get(employee, '_doc.point_type', {});
            for (const key in pointType) {
                if (pointType.hasOwnProperty(key)) {
                    let amount = pointType[key];
                    let point = this._mark(exchangeMarkType, voteExchangeMark, key, lstEmployee.length);
                    total += amount*point;
                }
            }
        }
        return total;
    }
    //Sum point for employee with total ticket
    _pointToTalForEmployee(lstPointType, voteExchangeMark, exchangeMarkType, totalEmployee) {
        let total = 0;
        for (const key in lstPointType) {
            if (lstPointType.hasOwnProperty(key)) {
                let amount = lstPointType[key];
                let point = this._mark(exchangeMarkType, voteExchangeMark, key, totalEmployee);
                total += amount*point;
            }
        }
        return total;
    }
    /**
     * @description mark point
     * @param  {string} markType
     * @param  {object} exchangeMark
     * @param  {Number} pointLevel
     * @param  {Number} total
     */
    _mark(markType, exchangeMark, pointLevel, total = null) {
        let point = 0;
        let coefficient = 100;

        if (markType === ModelVotingLimitSetting.EXCHANGE_MARK_TYPE_FIXED) {
            point = exchangeMark[pointLevel].value;
        }

        if (markType === ModelVotingLimitSetting.EXCHANGE_MARK_TYPE_RATIO) {
            point = exchangeMark[pointLevel].value;
            let rowMethodName = exchangeMark[pointLevel].round_method;
            point = (point*total)/coefficient;
            point =  ModelVotingLimitSetting.ROUND_METHOD[rowMethodName](point);
        }
            
        return point;
    }
}

module.exports = helperClass.exportClassMethod(VoteController, [
    'create',
    'update',
    'delete',
    'list',
    'detail',
    'detailVoteById',
    'activate',
    'deactivate',
    'submitResult',
    'exportVoteResults',
    'exportVoteResult',
]);