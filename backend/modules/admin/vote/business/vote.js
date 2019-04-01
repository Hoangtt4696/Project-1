'use strict';

const _ = require('lodash');
const path = require('path');
const BaseBusiness = require(path.resolve('./core/business/base'));
const ModelVote = require('../model/vote');
const ModelVotePoint = require('../../vote-point/model/vote-point');
const callAPI = require(path.resolve('./helper/call-api'));
const helperDate       = require(path.resolve('./helper/date-time'));
const lang = require(path.resolve('./helper/lang.js'));
const emailAPI = require(path.resolve('./lib/email/hrvemail.server.api.js'));

module.exports = class VoteBusiness extends BaseBusiness {
  constructor(user, data, model, req) {
    super();
    this._user = user;
    this._data = data;
    this._model = model;
    this._listContractType = [];
    this._req = req;
  }

  async _getEmployees(param = null) {
    let [err, res] = await callAPI(callAPI.HR_LIST_EMPLOYEES, param, this._user);
    if (err) {
      return this._setError(err.message);
    }
    let items = _.get(res, 'data', []);

    return items;
  }
  async _getContactType() {
    let [err, res] = await callAPI(callAPI.HR_LIST_CONTRACT_TYPE, {}, this._user);
    if (err) {
      return this._setError(err.message);
    } else {
      let result = [];
      let items = _.get(res, 'data', []);
      for (let index in items) {
        let item = items[index];
        if (item.contractTypeGroupId === 1) {
          result.push(item.id);
        }
      }
      this._listContractType = result;
    }
  }

  async _optHandler(optDepartment = null, optJobTitle = null) {
    let arrEmployee = [];
    let param = {};

    param.page_size = 20;
    param.statusactive = 1;
    if (this._data.number_of_contract_days) {
      param.contractDay = this._data.number_of_contract_days;
    }

    if (this._data.contract_condition) {
      param.contractDayQueryType = this._data.contract_condition;
    }

    if (optDepartment) {
      param.departmentId = optDepartment;
    }

    if (optJobTitle) {
      param.jobtitleId = optJobTitle;
    }

    let arrItem = await this._getEmployees(param);
    let total = _.get(arrItem, 'totalCount', 0);
    let countGet = this._getTimesCallApi(total);

    let items = _.get(arrItem, 'data', []);
    /* get nv chinh thức */
    for (let key in items) {
      let item = items[key];
      if (this._listContractType.indexOf(item.contractTypeId) === -1) {
        items.splice(key, 1);
      }
    }



    arrEmployee.push(...items);

    if (countGet === 0 || countGet === 1) {
      return arrEmployee;
    }

    for (let i = 2; i <= countGet; i++) {
      param.page = i;
      let arrData = await this._getEmployees(param);
      let employees = _.get(arrData, 'data', []);
      arrEmployee.push(...employees);
    }

    return arrEmployee;
  }

  async _getEmployeeOptions() {

    let lstEmployee = [];
    let arrJobTitle = [...new Set(this._data.job_title.map(el => el))];
    let arrDeparment = [...new Set(this._data.department.map(el => el))];
    await this._getContactType();
    if (_.size(arrDeparment) === 0 && _.size(arrJobTitle) === 0) {
      let employees = await this._optHandler();
      lstEmployee.push(...employees);
    } else if (_.size(arrDeparment) === 0 && _.size(arrJobTitle) > 0) {
      await lang.PromiseAllStep(arrJobTitle, async jobTitle => {
        let employees = await this._optHandler(null, jobTitle);
        lstEmployee.push(...employees);
      }, 200, this);
    } else if (_.size(arrDeparment) > 0 && _.size(arrJobTitle) === 0) {
      await lang.PromiseAllStep(arrDeparment, async department => {
        let employees = await this._optHandler(department, null);
        lstEmployee.push(...employees);
      }, 200, this);
    } else {
      for (let i = 0; i < arrDeparment.length; i++) {
        const department = arrDeparment[i];
        await lang.PromiseAllStep(arrJobTitle, async jobTitle => {
          let employees = await this._optHandler(department, jobTitle);
          lstEmployee.push(...employees);
        }, 200, this);
      }
    }

    return lstEmployee;
  }

  _isUpdatedEmployee() {
    const model = this._model;
    const data = this._data;
    const empList = model.employee_list || [];
    const newEmpList = data.employee_list || [];

    let isChange = false;

    if (_.isEmpty(empList)) {
      return !_.isEmpty(newEmpList);
    }

    if (newEmpList.length > empList.length) {
      return true;
    }

    newEmpList.forEach(emp => {
      isChange = empList.every((item) => {
        return item.employee_id !== emp.employee_id;
      });
    });

    if (isChange) {
      return true;
    }

    newEmpList.forEach(emp => {
      const empMatch = empList.filter(item => {
        return item.employee_id === emp.employee_id;
      });

      if (empMatch[0].join !== emp.join) {
        isChange = true;
      }
    });

    if (isChange) {
      return true;
    }

    return false;
  }

  _isChangeModel() {
    if (this._isUpdatedEmployee()) {
      return true;
    }

    const data = _.cloneDeep(this._data);
    const model = _.cloneDeep(this._model);

    if (JSON.stringify(data) !== JSON.stringify(model)) {
      return true;
    }

    return false;
  }

  /**
   * @description insert data into database
   */
  async insert() {
    let lstEmployee = await this._getEmployeeOptions();
    let data = this._formatPreInsert(lstEmployee);
    let vote = await ModelVote.insert(data, 'Insert Vote', null);
    if (ModelVote.error && !vote) {
      await this._sendMail(this._data.name, null, false);
      return this._setError(ModelVote.message);
    }
    await this._sendMail(vote.name, vote._id, true);
    return vote;
  }

  /**
   * @description insert data into database
   */
  async insertWithFormat(data) {
    let vote = await ModelVote.insert(data, 'Insert Vote', null);

    if (ModelVote.error) {
      return this._setError(ModelVote.message);
    }

    return vote;
  }

  /**
   * @description update data
   */
  async put(data) {
    let filter = { _id: _.get(this._req, 'params.id', undefined) };

    const vote = await ModelVote.updated(data, filter, null, null, false);

    if (ModelVote.error) {
      return this._setError(ModelVote.message);
    }

    return vote;
  }
  /**
   * @description validate data
   */
  async _validate(isUpdate = false) {
    if (!_.isObjectLike(this._user)) {
      this._setError('Tài khoản không hợp lệ');
    }
    if (!isUpdate && (!_.isObjectLike(this._data) || _.size(this._data) <= 0)) {
      this._setError('Dữ liệu không hợp lệ');
    }
    let strName = _.get(this._data, 'name', '');
    if (_.size(strName) > 200) {
      this._setError('Tên cuộc bình chọn quá 200 ký tự');
    } else if (!isUpdate && _.size(strName) <= 0) {
      this._setError('Vui lòng nhập tên cuộc bình chọn');
    }

    if (!isUpdate && !_.isArray(this._data.department_unit)) {
      this._setError('Vui lòng chọn loại đơn vị tham gia');
    }
    
    if (!isUpdate && !_.isArray(this._data.department)) {
      this._setError('Vui lòng chọn đơn vị tham gia');
    }
    
    if (!isUpdate && !_.isArray(this._data.job_title)) {
      this._setError('Vui lòng chọn chức danh tham gia');
    }
    
    if (!isUpdate && this._data.number_of_contract_days === null) {
      this._setError('Vui lòng nhập số ngày làm việc chính thức');
    } else {
      let numContractDay = _.get(this._data, 'number_of_contract_days', 0);
      if (!isUpdate && !_.isNumber(numContractDay)) {
        this._setError('Số ngày làm việc chính thức không đúng định dạng. Vui lòng nhập lại');
      }
    }

    if (!isUpdate && !this._data.time_vote_manager) {
      this._setError('Vui lòng chọn thời gian bình chọn của quản lý');
    }

    if (!isUpdate && !this._data.time_vote_employee) {
      this._setError('Vui lòng chọn thời gian bình chọn của nhân viên');
    }
    
    let strCheckActive = await this._checkVoteActived();
    if (!isUpdate && strCheckActive !== '') {
      this._setError(`Đơn vị [${strCheckActive}] đã có cuộc bình chọn cùng kỳ. Vui lòng kiểm tra lại.`);
    }
    
    const timeVoteManager = this._data.time_vote_manager;
    const timeVoteEmployee = this._data.time_vote_employee;
    
    let timeNow = new Date();
    timeNow.setHours(0, 0, 0, 0);
    timeNow = helperDate.toTimestamp(timeNow);  

    if (!isUpdate && timeVoteManager && timeVoteManager.from < timeNow) {
      this._setError('Thời gian bình chọn không được nhỏ hơn hiện tại. Vui lòng kiểm tra lại.');
    } else if (!isUpdate && timeVoteEmployee && timeVoteEmployee.from < timeNow) {
      this._setError('Thời gian bình chọn không được nhỏ hơn hiện tại. Vui lòng kiểm tra lại.');
    }

    const timeIsNaNManager = timeVoteManager
      && (isNaN(timeVoteManager.from)
        || isNaN(timeVoteManager.to));
    const timeIsNaNEmployee = timeVoteEmployee
      && (isNaN(timeVoteEmployee.from)
        || isNaN(timeVoteEmployee.to));

    const timeNotMillisecondsManager = timeVoteManager
      && ((timeVoteManager.from && _.size(timeVoteManager.from.toString()) !== 13)
        || (timeVoteManager.to && _.size(timeVoteManager.to.toString()) !== 13));
    const timeNotMillisecondsEmployee = timeVoteEmployee
      && ((timeVoteEmployee.from && _.size(timeVoteEmployee.from.toString()) !== 13)
        || (timeVoteEmployee.to && _.size(timeVoteEmployee.from.toString()) !== 13));

    if (timeIsNaNEmployee || timeIsNaNManager || timeNotMillisecondsManager || timeNotMillisecondsEmployee) {
      this._setError('Thời gian bình chọn không đúng định dạng. Vui lòng chọn lại');
    }
  }

  _resetPoint(lstEmployee) {
    return lstEmployee.map(emp => {
      emp.point = 0;
      emp.point_type = {};

      return emp;
    });
  }

  _cloneByDept({ data, deptId, isNew = false }) {
    if (!deptId) {
      return {};
    }

    if (isNew) {
        if (data.department) {
            data.department = [Number(deptId)];
            data.department_detail = data.department_detail.filter(dept => {
              return Number(deptId) === dept.id;
            });
        }
        if (data.department_active) {
          data.department_active = data.department_active.filter(dept => {
            return dept === Number(deptId);
          });
        }
        if (data.employee_list) {
          data.employee_list = data.employee_list.filter(emp => {
            return emp.employee_department_vote === Number(deptId);
          });
        }

        data.amount = data.employee_list.length;
    } else {
        if (data.department) {
          data.department = data.department.filter(dept => {
            return dept !== Number(deptId);
          });

          data.department_detail = data.department_detail.filter(dept => {
            return Number(dept.id) !== Number(deptId);
          });
        }

        if (data.department_active) {
          data.department_active = data.department_active.filter(dept => {
            return dept !== Number(deptId);
          });
        }

        if (data.employee_list) {
          data.employee_list = data.employee_list.filter(emp => {
            return emp.employee_department_vote !== Number(deptId);
          });
        }

        data.amount = data.employee_list.length;
    }

    return data;
  }

  /**
   * @description format data
   */
  async update() {
    this._validate(true);

    if (this.error) {
      return;
    }

    const isUpdateEmp = this._isUpdatedEmployee();
    let model = this._model;
    const data = this._data;
    let isEmpExist = false;

    if (!this._isChangeModel()) {
      return data;
    }

    if (data.employee_list && data.departmentVote) {
      data.employee_list.forEach(emp => {
        const empMatch = data.employee_list.filter(newEmp => {
          return newEmp.employee_id === emp.employee_id
              && newEmp.employee_department_vote === data.departmentVote;
        });

        if (empMatch.length > 1) {
          isEmpExist = true;
        }
      });
    }

    if (isEmpExist) {
      this._setError('Nhân viên đã có trong cuộc bình chọn');

      return ;
    }

    const _id = _.get(this._req, 'params.id');

    let isChangeActive = false;

    if (Object.keys(data).length === 1 && data.hasOwnProperty('activate')) {
      isChangeActive = model.activate !== data.activate;
    }
    
    if (!isChangeActive && !data.departmentVote) {
      this._setError('Vui lòng nhập đơn vị tham gia');

      return;
    }
    
    const isMultiDept = _.size(model.department);
    let deptId = data.departmentVote;

    deptId = Number(deptId);

    data.user_id = this._user.employee_id;
    data.orgid = this._user.orgid;

    if (isUpdateEmp) {
      if (isMultiDept <= 1) {
        model.employee_list = this._resetPoint(model.employee_list);
        data.employee_list = this._resetPoint(data.employee_list);

        let lstEmp = _.cloneDeep(this._model.employee_list);

        data.employee_list.forEach(emp => {
          let isMatch = false;

          for (let i = 0; i < lstEmp.length; i++) {
            if (lstEmp[i].employee_id === emp.employee_id) {
              lstEmp[i] = emp;
              isMatch = true;
            }
          }

          if (!isMatch) {
            lstEmp.push(emp);
          }
        });

        data.amount = _.size(lstEmp);
        data.employee_list = lstEmp;

        delete data.departmentVote;

        await ModelVotePoint.deleted({ department_id: deptId, vote_id: _id });

        if (this.error) {
          return ;
        }

        return await this.put(data);
      } else {
          const modelUpd = this._cloneByDept({ data: _.cloneDeep(model), deptId });

          await this.put(modelUpd);

          if (this.error) {
              return ;
          }

          let votingClone = _.cloneDeep(this._model);

          votingClone = _.mergeWith(votingClone, data, (valModel, valVoting) => {
              if (_.isArray(valModel)) {
                return valVoting;
              }
          });

          votingClone.employee_list = this._resetPoint(data.employee_list);

          votingClone = this._cloneByDept({ data: votingClone, deptId, isNew: true});

          delete votingClone.departmentVote;

          ModelVotePoint.deleted({ department_id: deptId, vote_id: _id });

          if (this.error) {
            return ;
          }

          return await this.insertWithFormat(votingClone);
      }
    } else {
      if (!isChangeActive) {
        if (isMultiDept <= 1) {
          return await this.put(data);
        } else {
          let dataClone = _.cloneDeep(model);

          dataClone = this._cloneByDept({ data: dataClone, deptId });

          delete dataClone.departmentVote;

          await this.put(dataClone);

          if (this.error) {
            return ;
          }

          let votingClone = this._cloneByDept({ data: _.cloneDeep(model), deptId, isNew: true });

          votingClone = _.mergeWith(votingClone, data, (valVoting, valData) => {
            if (_.isArray(valVoting)) {
              return valData;
            }
          });

          delete votingClone.departmentVote;

          return await this.insertWithFormat(votingClone);
        }
      } else {
        const isDeptActiced = await ModelVote.select({
          year_month_vote: Number(model.year_month_vote),
          activate: true,
          department_active_id: model.department,
          _id: { $ne: model._id },
        });

        if (isDeptActiced.length > 0 && data.activate) {
          this._setError('Không thể kích hoạt. Đơn vị này đã có cuộc bình chọn cùng kỳ. Vui lòng kiểm tra lại.');
        } else if (isDeptActiced.length === 0 && data.activate) {
          model.department_active = model.department;
          model.activate = data.activate;

          return await this.put(model);
        } else if (!data.activate) {
          data.department_active = [];

          return await this.put(data);
        }
      }
    }
    }

  async active() {
    this._validate(true);

    if (this.error) {
      return;
    }

    let model = this._model;
    const data = this._data;

    const isMultiDept = _.size(model.department);

    if (!data.departmentVote) {
      this._setError('Vui lòng nhập đơn vị tham gia');

      return ;
    }

    let deptId = data.departmentVote;

    deptId = Number(deptId);

    const periodVoting = Number(model.year_month_vote);

    const isActived = await ModelVote.select({
      activate: true,
      year_month_vote: periodVoting,
      department_active_id: deptId,
      _id: {$ne: model._id}
    });

    if (isMultiDept <= 1) {
      if (_.isEmpty(isActived)) {
        model.department_active.push(deptId);

        return await this.put({
          department_active: model.department_active,
          user_id: this._user.employee_id,
          orgid: this._user.orgId,
          activate: true,
        });
      } else {
        this._setError('Không thể kích hoạt. Đơn vị này đã có cuộc bình chọn cùng kỳ. Vui lòng kiểm tra lại.');

        return ;
      }
    } else {
      if (_.isEmpty(isActived)) {
        const cloneVoting = this._cloneVoting(deptId);

        cloneVoting.department_active = [deptId];
        cloneVoting.activate = true;

        await this.insertWithFormat(cloneVoting);

        if (this.error) {
          return ;
        }

        model.department = model.department.filter(dep => {
          return dep !== deptId;
        });
        model.department_detail = model.department_detail.filter(dep => {
          return Number(dep.id) !== deptId;
        });
        model.department_active = model.department_active.filter(dept => {
          return dept !== deptId;
        });
        model.employee_list = model.employee_list.filter(emp => {
          return emp.employee_department_vote !== deptId;
        });
        model.amount = model.employee_list.length;

        return await this.put(model);
      } else {
        this._setError('Không thể kích hoạt. Đơn vị này đã có cuộc bình chọn cùng kỳ. Vui lòng kiểm tra lại.');

        return ;
      }
    }
  }

  _cloneVoting(deptId) {
    const model = _.cloneDeep(this._model);

    deptId = Number(deptId);

    model.department = [deptId];
    model.department_detail = model.department_detail.filter(dept => {
      return Number(dept.id) !== deptId;
    });
    model.employee_list = model.employee_list.filter(emp => {
      return emp.employee_department_vote === deptId;
    });
    model.amount = model.employee_list.length;

    return model;
  }

  async deactivate() {
    this._validate(true);

    if (this.error) {
      return;
    }

    let model = this._model;
    const data = this._data;

    const isMultiDept = _.size(model.department);

    if (!data.departmentVote) {
      this._setError('Vui lòng nhập đơn vị tham gia');

      return ;
    }

    let deptId = data.departmentVote;

    deptId = Number(deptId);

    if (isMultiDept <= 1) {
      model.department_active = model.department_active.filter(dept => {
        return dept !== deptId;
      });
      model.activate = false;

      return await this.put(model);
    } else {
      const cloneVoting = this._cloneVoting(deptId);

      cloneVoting.department_active = [];
      cloneVoting.department_detail = model.department_detail.filter(dep => {
        return Number(dep.id) === deptId;
      });
      cloneVoting.activate = false;

      await this.insertWithFormat(cloneVoting);

      if (this.error) {
        return ;
      }

      model.department = model.department.filter(dep => {
        return dep !== deptId;
      });
      model.department_detail = model.department_detail.filter(dep => {
        return Number(dep.id) !== deptId;
      });
      model.department_active = model.department_active.filter(dept => {
        return dept !== deptId;
      });
      model.employee_list = model.employee_list.filter(emp => {
        return emp.employee_department_vote !== deptId;
      });
      model.amount = model.employee_list.length;

      return await this.put(model);
    }
  }

  async _checkVoteActived() {
    let strDeparment = '';
    let arrDepartmentActived = [];
    let votes = await ModelVote.select({ activate: true, year_month_vote: this._data.year_month_vote });

    if (_.size(this._data.department) === 0 && votes) {
      for (let i = 0; i < votes.length; i++) {
        const element = votes[i];
        arrDepartmentActived.push(...element.department_active);
      }
    } else if (_.size(this._data.department) !== 0 && votes) {
      let arrDepartmentCheck = this._data.department;
      for (let i = 0; i < votes.length; i++) {
        const element = votes[i];
        let arrDep = _.intersection(arrDepartmentCheck, element.department_active);
        arrDepartmentActived.push(...arrDep);
      }
    }
    arrDepartmentActived = [...new Set(arrDepartmentActived.map((el) => {
      return el;
    }))];
    
    let arrDeparment = [];
    await Promise.all(arrDepartmentActived.map(async department => {
      let [err, res] = await callAPI(callAPI.HR_DEPARTMENT_DETAIL, {id: department}, this._user);
      if (err) {
        return this._setError(err.message);
      }
      let item = _.get(res, 'data', []);
      arrDeparment.push(item.name);
    }, this));

    strDeparment = _.map(arrDeparment).join(', ');
    return strDeparment;
  }

  _formatPreInsert(lstEmployee) {
    let data = this._data;
    data.user_id = this._user.employee_id;
    data.orgid = this._user.orgid;

    data.department_active = data.department;
    data.employee_list = [];
    lstEmployee.forEach(employee => {
      data.employee_list.push(this._formatEmployee(employee));
    });

    data.amount = _.size(data.employee_list);

    return data;
  }

  _formatEmployee(data) {
    let employee = {
      employee_name: data.name,
      employee_photo: data.photo,
      employee_job_title_id: data.jobtitleId,
      employee_job_title: data.jobtitleName,
      employee_id: data.id,
      employee_userId: data.userId,
      employee_haraId: data.haraId,
      employee_department_id: data.departmentId,
      employee_department_name: data.departmentName,
      employee_department_vote: data.departmentId,
      employee_department_vote_name: data.departmentName
    };

    return employee;
  }

  _getTimesCallApi(total) {
    let defaultLimit = 20;
    return Math.ceil(total / defaultLimit);
  }

  async _sendMail(voteName, voteId = null, isSuccess) {
    var emailTemplate = path.resolve('./lib/email/templates/create_vote.html');
    let dataInfo = {
      user          : this._user,
      subjectType   : 'Tạo cuộc bình chọn',
      link: global.config.host + `/site/voting-details/${voteId}`,
      isSuccess: isSuccess,
      voteName: voteName
    };

    emailAPI.sendEmailWithTemplate(dataInfo, emailTemplate);
  }

};