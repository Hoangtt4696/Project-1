'use strict';
let path = require('path');
let _ = require('lodash');
let heplerObjectArray = require(path.resolve('./helper/object-array.js'));

module.exports = class BaseController {
  constructor(req = {}, res = {}, next, id, model) {
    this._model = model || req.model;
    this._req = req;
    this._res = res;
    this._next = next;
    this._id = id;
    this._shop_id = 0;
    this._shop = '';
    this._user = {};
    this._body = {};
    this._query = {};
    /*Page*/
    this._limit = 50;
    this._page = 1;
    this._skip = 50;
    this._sort_type = 'desc';
    this._sort_by = '_id';
    this._sort = {};
    this._error = false;
    this._message = [];
    this._HaravanAPI = null;
    /*shop_id, user, _filter*/
    this.getRequireDataList();
    /*limit, skip, page, sort */
    this.getPageDataList();
    this._filter = {
      ...this._filter,
      limit: this._limit,
      page: this._page,
      skip: this._skip,
      sort: this._sort,
    }
  }

  getDetail() {
    let data = this._req.model;
    return this.renderJson(data);
  }

  async midlewareGetDetailByID(model, field = '_id') {
    let response = await this._getDataByID(model, field);
    if (this._error) {
      return this.renderError(this._message);
    } else {
      this._req.model = response;
      this._next();
    }
  }

  async _getDataByID(model, field = '_id') {
    let _this = this;
    let newModel = model;
    let response = {};
    if (this._id) {
      let filter = {};
      filter[field] = this._id;
      let data = await newModel.selectOne(filter);

      if (newModel.error) {
        _this._error = newModel.error;
        _this._message = newModel.message;
      } else if (!data) {
        _this._error = true;
        _this._message.push('Không tìm thấy dữ liệu với id là ' + this._id);
      }

      response = _.get(data, '_doc', data);
    }

    return response;
  }

  getRequireDataList() {
    if (this._req.hasOwnProperty('user') && this._req.user) {
      this._user = this._req.user.hasOwnProperty('_doc') ? this._req.user._doc : this._req.user;
    }
    /*parse req.body to object*/
    if (heplerObjectArray.filledObject(this._req.body)) {
      Object.setPrototypeOf(this._req.body, {});
    }
    if (heplerObjectArray.filledObject(this._req.query)) {
      Object.setPrototypeOf(this._req.query, {});
    }
    if (this._req.body && this._req.body.filter && Object.keys(this._req.body.filter).length) {
      this._filter = this._req.body.filter;
      this.removeObjectValueFromObject(this._filter);
    }
    if (this._req.body && Object.keys(this._req.body).length) {
      this._body = this._req.body;
    }

    if (this._req.query && Object.keys(this._req.query).length) {
      this._query = this._filter = this._req.query;
      this.removeObjectValueFromObject(this._query);
      this.removeObjectValueFromObject(this._filter);
    }
       
    if (this._req.hasOwnProperty('HaravanAPI') && this._req.HaravanAPI) {
      this._HaravanAPI = this._req.HaravanAPI;
    }
  }

  getPageDataList() {
    let data = {};
    if (this._req.method === 'GET') {
      data = this._req.query;
    } else {
      data = this._req.body;
    }

    this.getPageDataListDetail(data);
  }

  getPageDataListDetail(data) {
    this._limit = data.limit ? parseInt(data.limit) : this._limit;
    this._page = data.page ? data.page : this._page;
    this._skip = (this._page - 1) * this._limit ? (this._page - 1) * this._limit : 0;
    this._sort_type = data.sort_type ? data.sort_type.toLowerCase() : 'desc';
    this._sort_by = data.sort_by || '_id';
    this._sort[this._sort_by] = this._sort_type === 'desc' ? -1 : 1;
  }

  removeObjectValueFromObject(obj) {
    if (typeof obj === 'object') {
      for (let key in obj) {
        // value is an array, remove all object element
        if (Array.isArray(obj[key])) {
          let arr = obj[key];
          let new_arr = [];
          for (let i in arr) {
            if (typeof arr[i] !== 'object' && typeof arr[i] !== 'function') {
              new_arr.push(arr[i]);
            }
          }
          obj[key] = new_arr;
          continue;
        }
        // value is an object, remove this
        if (typeof obj[key] === 'object' || typeof obj[key] === 'function') {
          delete obj[key];
        }
      }
    }
  }

  validateList() {
    let pass = true;
    if (this._shop_id === 0 || !Object.keys(this._filter).length) {
      pass = false;
    }
    return pass;
  }



  renderError(msg, code = 422, option = {}) {
    if (!msg) {
      msg = ['Có lỗi xảy ra vui lòng thử lại vào lúc khác']
    } else {
      if (!Array.isArray(msg)) {
        msg = [msg];
      }
    }

    return this._res.status(code).json({
      error: true,
      message: msg,
      ...option
    });
  }

  renderJson(json, code = 200) {
    return this._res.status(code).json(json);
  }
};
