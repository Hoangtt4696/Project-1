let path = require('path');
let helperObjectArray = require(path.resolve('./helper/object-array.js'));
let helperStringNumber = require(path.resolve('./helper/string-number.js'));
let _ = require('lodash');

module.exports = class BaseBussiness {
  constructor() {
    this.error = false;
    this.message = [];
    this.objectCheckExist = null;
  }

  _validateListContanst(data, field, field_name, list, allowEmpty) {
    let pass = true;
    if (!_.get(data, field) || !parseFloat(data[field]) && !allowEmpty) {
      pass = false;
      this._setError(field_name + ' không được rỗng');
    } else {
      if (list.indexOf(parseFloat(data[field])) < 0) {
        this._setError(field_name + ' không hợp lệ');
        pass = false;
      }
    }

    return pass;
  }

  /*
   * ======== CHECK DATA HAS IN DB ======================
   * Data in request
   * Field in request
   * Field name tieng viet response client
   * Object filter set param default (ex: shop_id)
   * Class query bussiness
   * Field in db
   * Check empty before check exist
   * Get data return after check exist data (set in this.objectCheckExist)
   *
   * */
  async _validateExist(data, field, field_name, filter, MyMD, field_model, allowEmpty = false, getObject = false) {
    let pass = true;
    field_model = field_model ? field_model : field;
    if (helperObjectArray.fillObject(data, field) && helperStringNumber.hasValue(data[field])) {
      filter[field_model] = data[field];
      let count = 0;
      if (getObject) {
        this.objectCheckExist = await MyMD.selectOne(filter);
        this.objectCheckExist = Object.assign({}, this.objectCheckExist);
        if (this.objectCheckExist && Object.keys(this.objectCheckExist).length)
          {count = 1;}
      } else {
        count = await objQuery.count(filter);
      }
      if (count <= 0) {
        pass = false;
        this._setError(field_name + ' không tồn tại');
      }
    } else {
      if (!allowEmpty) {
        pass = false;
        this._setError(field_name + ' không được rỗng');
      }
    }

    return pass;
  }

  async _validateNotExistNotCapital(data, field, field_search, field_name, filter, MyMD, allowEmpty = false, getObject = false) {
    let pass = true;
    if (helperObjectArray.fillObject(data, field) && helperStringNumber.hasValue(data[field])) {
      filter[field_search] = { '$regex': data[field], '$options': 'i' };
      let count = 0;
      if (getObject) {
        this.objectCheckExist = await MyMD.filter(filter);
        count = this.objectCheckExist.length;
      } else {
        count = await MyMD.countDocuments(filter);
      }
      if (count > 0) {
        pass = false;
        this._setError({ [field_search]: field_name + ' đã tồn tại' });
      }

    } else {
      if (!allowEmpty) {
        pass = false;
        this._setError(field_name + ' không được rỗng');
      }
    }

    return pass;
  }

 

  // Check rỗng giá trị
  validateEmpty(data, field, field_name, list) {
    let pass = true;
    if (!helperObjectArray.fillObject(data, field) || !helperStringNumber.hasValue(data[field])) {
      pass = false;
      this._setError(field_name + ' không không được rỗng');
    }
    return pass;
  }

  _setError(message) {
    // if message if Error object, get Error.message
    if (typeof message === 'object' && typeof message.message === 'string') {
      message = message.message;
    }
    this.error = true;
    if (Array.isArray(message)) {
      this.message = this.message.concat(message);
    }
    else {
      this.message.push(message);
    }
  }
}