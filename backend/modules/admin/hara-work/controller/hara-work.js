/**
 * @author Tran Dinh Hoang
 */

'use strict';

const _              = require('lodash');
const path           = require('path');
const callAPI        = require(path.resolve('./helper/call-api'));
const helperClass    = require(path.resolve('./helper/class'));
const BaseController = require(path.resolve('./core/controller/base'));
const handle         = require(path.resolve('./helper/handle'));

class HaraWorkController extends BaseController {
  constructor(req, res, next) {
    super(req, res, next);
  }

  async getDepartment() {
    let [err, res] = await callAPI(callAPI.HR_DEPARTMENT_DETAIL, { id: this._req.params.id }, this._req.user);
    if (err) {
      return this.renderError(handle(err));
    }
    return this.renderJson(res.data);
  }

  async listDepartments() {
    let data;
    if (this._query.isGetAll) {
      // backup and delete some param
      let [o_page, o_limit, o_page_size] = [this._query.page, this._query.limit, this._query.page_size];

      delete this._query.isGetAll;
      delete this._query.page;
      delete this._query.page_size;

      let [err, res] = await callAPI(callAPI.HR_LIST_DEPARTMENT, this._query, this._user);
      if (err) {
        return this.renderError(handle(err));
      }
      data = {
        total : _.get(res, 'data.totalCount', 0),
        items : _.get(res, 'data.data', [])
      }
      // list remain user HR
      if (data.total > data.items.length) {
        let page_size = data.items.length;
        let page_count = Math.ceil((data.total - data.items.length) / page_size);
        await Promise.all(_.range(1, page_count + 1).map(async page => {
          let query = _.cloneDeep(this._query);
          query.page = page + 1;
          query.page_size = page_size;
          let [err, res] = await callAPI(callAPI.HR_LIST_DEPARTMENT, query, this._user);
          if (err || res.error ) {
            return console.log(`ERROR list department failed : ${JSON.stringify(err)}`);
          }
          data.items = data.items.concat(_.get(res, 'data.data', []));
        }, this));
      }

      // pagination
      o_limit = o_limit || o_page_size;
      if (_.gt(o_page, 0) && _.gt(o_limit, 0)) {
        let skip = (o_page -1 ) * o_limit;
        data.items = data.items.slice(skip);
      }
      if (_.gt(o_limit, 0)) {
        data.items = data.items.slice(0, o_limit);
      }
    }
    else {
      if (!this._query.page_size && this._query.limit) {
        this._query.page_size = this._query.limit;
      }
      let [err, res] = await callAPI(callAPI.HR_LIST_DEPARTMENT, this._query, this._req.user);
      if (err) {
        return this.renderError(handle(err));
      }
      data = {
        total: _.get(res, 'data.totalCount', 0),
        items: _.get(res, 'data.data', [])
      }
    }

    return this.renderJson(data);
  }

  async getDepartmentUnit() {
    let [err, res] = await callAPI(callAPI.HR_DEPARTMENT_UNIT_DETAIL, { id : this._req.params.id }, this._req.user);
    if (err) {
      return this.renderError(handle(err));
    }
    return this.renderJson(res.data);
  }

  async listDepartmentUnits() {
    if (!this._query.page_size && this._query.limit) {
      this._query.page_size = this._query.limit;
    }
    let [err, res] = await callAPI(callAPI.HR_LIST_DEPARTMENT_UNIT, this._query, this._req.user);
    if (err) {
      return this.renderError(handle(err));
    }

    let data = {
      total : _.get(res, 'data.length', 0),
      items : _.get(res, 'data', [])
    }
    return this.renderJson(data);
  }

  async getEmployee() {
    let [err, res] = await callAPI(callAPI.GET_EMPLOYEES_DETAIL, { id: this._req.params.id }, this._req.user);
    if (err) {
      return this.renderError(handle(err));
    }
    return this.renderJson(res.data);
  }

  async listEmployees() {
    let data;
    if (this._query.isGetAll) {
      // backup and delete some param
      let [o_page, o_limit, o_page_size] = [this._query.page, this._query.limit, this._query.page_size];

      delete this._query.isGetAll;
      delete this._query.page;
      delete this._query.page_size;

      let [err, res] = await callAPI(callAPI.HR_LIST_EMPLOYEES, this._query, this._user);
      if (err) {
        return this.renderError(handle(err));
      }
      data = {
        total : _.get(res, 'data.totalCount', 0),
        items : _.get(res, 'data.data', [])
      }
      // list remain employees
      if (data.total > data.items.length) {
        let page_size = data.items.length;
        let page_count = Math.ceil((data.total - data.items.length) / page_size);
        await Promise.all(_.range(1, page_count + 1).map(async page => {
          let query = _.cloneDeep(this._query);
          query.page = page + 1;
          query.page_size = page_size;
          let [err, res] = await callAPI(callAPI.HR_LIST_EMPLOYEES, query, this._user);
          if (err || res.error ) {
            return console.log(`ERROR list employees failed : ${JSON.stringify(err)}`);
          }
          data.items = data.items.concat(_.get(res, 'data.data', []));
        }, this));
      }

       // pagination
       o_limit = o_limit || o_page_size;
       if (_.gt(o_page, 0) && _.gt(o_limit, 0)) {
         let skip = (o_page -1 ) * o_limit;
         data.items = data.items.slice(skip);
       }
       if (_.gt(o_limit, 0)) {
         data.items = data.items.slice(0, o_limit);
       }
    }
    else {
      if (!this._query.page_size && this._query.limit) {
        this._query.page_size = this._query.limit;
      }
      let [err, res] = await callAPI(callAPI.HR_LIST_EMPLOYEES, this._query, this._req.user);
      if (err) {
        return this.renderError(handle(err));
      }
      data = {
        total: _.get(res, 'data.totalCount', 0),
        items: _.get(res, 'data.data', [])
      }
    }

    return this.renderJson(data);
  }

  // async bak_listEmployees() {
  //   if (!this._query.page_size && this._query.limit) {
  //     this._query.page_size = this._query.limit;
  //   }
  //   let err, res, data;
  //   if (this._query.isGetAll) {
  //     [err, res] = await callAPI(callAPI.HR_LIST_EMPLOYEES_ALL, this._query, this._req.user);
  //   }
  //   else {
  //     [err, res] = await callAPI(callAPI.HR_LIST_EMPLOYEES, this._query, this._req.user);
  //   }
  //   if (err) {
  //     return this.renderError(handle(err));
  //   }
  //   data = {
  //     total: _.get(res, 'data.totalCount', 0),
  //     items: _.get(res, 'data.data', [])
  //   }
  //   return this.renderJson(data);
  // }

  async getSalaryElement() {
    let [err, res] = await callAPI(callAPI.HR_GET_SALARY_ELEMENT, { id: this._req.params.id }, this._req.user);
    if (err) {
      return this.renderError(handle(err));
    }
    return this.renderJson(res.data);
  }

  async listSalaryElements() {
    if (!this._query.page_size && this._query.limit) {
      this._query.page_size = this._query.limit;
    }
    let err, res, result = { total: 0, items: [] };
    if (this._query.isGetAll === true || this._query.isGetAll === 'true') {
      [err, res] = await callAPI(callAPI.HR_LIST_ALL_SALARY_ELEMENTS, {}, this._req.user);
      result.items = _.get(res, 'data', []);
      result.total = result.items.length;
    } else {
      [err, res] = await callAPI(callAPI.HR_LIST_SALARY_ELEMENTS, this._query, this._req.user);
      result = {
        total: _.get(res, 'data.totalCount', 0),
        items: _.get(res, 'data.data', [])
      };
    }
    if (err) {
      return this.renderError(handle(err));
    }
    return this.renderJson(result);
  }

  async listJobTitles() {
    let list_department_id = this._query.list_department_id;
    if (typeof this._query.list_department_id === 'string') {
      list_department_id = this._query.list_department_id.split(',').map(id_string => Number(id_string));
    }
    if (Array.isArray(list_department_id) && list_department_id.length > 0) {
      this._query.isGetAll = true;
    }

    let [err, res] = await callAPI(callAPI.HR_LIST_JOB_TITLE, this._query, this._req.user);
    if (err){
      return this.renderError(handle(err));
    }

    let data = {
      total : _.get(res, 'data.totalCount', 0),
      items : _.get(res, 'data.data', [])
    }

    if (data.total > 0) {
      if (Array.isArray(list_department_id) && list_department_id.length > 0) {
        let new_items = [];
        data.items.forEach(item => {
          if (Array.isArray(item.departments)) {
            let matches = _.intersection(item.departments.map(d => d.departmentId), list_department_id);
            if (matches.length > 0) {
              new_items.push(item);
            }
          }
        });
        data.items = new_items;
        data.total = new_items.length;
      }
    }

    return this.renderJson(data);
  }

  async listJobTitlesByDepartmentId() {
    let [err, res] = await callAPI(callAPI.HR_LIST_JOB_TITLE, { departmentId : this._req.params.id }, this._req.user);
    if (err){
      return this.renderError(handle(err));
    }
    let items = res.data;
    return this.renderJson({
      total: items.length,
      items: items
    });
  }
}

module.exports = helperClass.exportClassMethod(HaraWorkController, [
  'getDepartment',
  'listDepartments',

  'getDepartmentUnit',
  'listDepartmentUnits',

  'getEmployee',
  'listEmployees',

  'listSalaryElements',
  'getSalaryElement',

  'listJobTitles',
  'listJobTitlesByDepartmentId'
]);