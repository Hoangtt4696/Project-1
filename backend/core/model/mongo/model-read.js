'use strict'

module.exports = class BaseRead {
  constructor(collection) {
    this.model = collection;
    this.modelOrigin = collection;
    this.message = [];
    this.error = false;
    this.criteria = {};
    this.aggregate = [];
    this.match_after = {};
    this.project = {};
    this.sort = {};
    this.limit = -1;
    this.skip = -1;
    this.lean = false;
    this.select_field = [];
  }

  _checkAggregate() {
    return this.aggregate.length ? true : false;
  }

  _setCursor() {
    if (this._checkAggregate()) {
      this.model = this.model.exec();
    } else {
      this.model = this.model.cursor();
    }
  }

  _setFunction() {
    this.model = this.modelOrigin;
    this.model = this.model.find(this.criteria, this._formatSelectField()).lean(this.lean);
    let setList = [{'skip': -1}, {'limit': -1}, {'sort': {}}]
    this._setFunctionItem(setList);
    this._setCursor();
  }

  _setFunctionItem(setList) {
    for (let i in setList) {
      let item = setList[i];
      let key = Object.keys(item)[0];
      let def = item[key];
      if (this.hasOwnProperty(key) && this[key] != def && this.model[key]) {
        this.model = this.model[key](this[key]);
      }
    }
  }

  _validateFunctionItem() {

  }

  _formatSelectField() {
    let result = {};
    if (this.select_field && this.select_field.length) {
      this.select_field.map(function (item) {
        result[item] = 1;
      })
    }

    return result;
  }

  _startQuery(onData, onEnd, onError) {
    let _this = this;
    let data = [];
    return new Promise((resolve, reject) => {
      try {
        _this.model.on('data', function (doc) {
          if (onData) {
            onData(doc);
          }
          data.push(doc);
        }).on('error', function (err) {
          if (onError) {
            onError(err);
          }
          reject(err);
        }).on('end', function () {
          if (onEnd) {
            onEnd(data);
          }
          resolve(data);
        });
      } catch (error) {
        _this._setError(error);
        resolve();
      }
    })
  }

  _getCount() {
    let _this = this;
    _this.model = _this.modelOrigin;
    return new Promise((resolve) => {
      try {
        _this.model.count(_this.criteria).exec(function (err, count) {
          if (err) {
            _this._setError(err);
            resolve();
          } else {
            resolve(count);
          }
        });
      } catch (error) {
        _this._setError(error);
        resolve();
      }
    })
  }

  _setError(err = '') {
    this.message.push(err);
    this.error = true;
  }

  _setAggregateFunction(item) {
    let keyAllow = ['match', 'group'];
    try {
      for (let key in item) {
        if (keyAllow.indexOf(key) > -1 && this[key] && Object.keys(this[key]).length && this.model[item]) {
          this.model = this.model[item](this[key]);
        }
      }
    } catch (error) {
      this._setError(error);
    }
  }

  async selectOne() {
    let _this = this;
    this.model = this.modelOrigin;
    return new Promise((resolve, reject) => {
      try {
        _this.model.findOne(this.criteria).lean(this.lean).exec((err, doc) => {
          if (err) {
            _this._setError(err);
          }
          resolve(doc);
        });
      } catch (error) {
        _this._setError(error);
        resolve();
      }
    })
  }

  async aggregate() {
    this.model = this.modelOrigin;
    for (let i = 0; i < this.aggregate.length; i++) {
      let item = this.aggregate[i];
      this._setAggregateFunction(item);
    }
  }

  async select(onData, onEnd, onError) {
    this._setFunction();
    try {
      return await this._startQuery(onData, onEnd, onError);
    } catch (error) {
      this._setError(error)
      return []
    }
  }

  async count() {
    return await this._getCount();
  }
};
