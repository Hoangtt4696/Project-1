'use strict'

let _ = require('lodash');


function formatObjectDoc(doc) {
  if (_.has(doc, '_doc')) {
    doc = doc.toObject();
  }

  return doc;
}
/*
  * =========================== INSERT UPDATE DELETE ===========================================
  */
module.exports = class BaseWrite {
  constructor(collection) {
    this._model = collection;
    this._modelOrigin = collection;
    this.error = false;
    this.message = [];
    this.time = 0;
  }

  insert(data) {
    this._resetError();
    this._model = this._modelOrigin;
    let _this = this;
    return new Promise((resolve, reject) => {
      try {
        let dataSave = new this._model(data);
        let errorsMD = [];
        dataSave.validate(async function (err) {
          try {
            if (err && err.errors) {
              for (let key in err.errors) {
                errorsMD.push(err.errors[key].message);
              }
              _this._setError(errorsMD.join(', '));
              resolve();
            } else {
              let doc = await dataSave.save();
              resolve(formatObjectDoc(doc));
            }
          } catch (e) {
            _this._setError(e);
            resolve();
          }
        });
      } catch (e) {
        this._setError(e)
        resolve();
      }
    })
  }

  updated(data, filter, upsert = false) {
    this._resetError();
    this._model = this._modelOrigin;
    let _this = this;
    return new Promise(async (resolve) => {
      try {
        _this._model.findOneAndUpdate(filter, { $set: data }, { new: true, upsert : upsert }, (err, doc) => {
          if (err) {
            _this._setError(err);
          }

          resolve(formatObjectDoc(doc));
        })
      } catch (error) {
        this._setError(error)
        resolve();
      }

    })
  }

  updateMulti(data, filter, upsert = false) {
    this._resetError();
    this._model = this._modelOrigin;
    let _this = this;

    return new Promise(async (resolve) => {
      try {
        _this._model.update(filter, { $set: data }, { new: true, multi: true, upsert : upsert }, (err, count) => {
          if (err) {
            _this._setError(err);
          }

          resolve(count);
        })
      } catch (error) {
        this._setError(error)
        resolve();
      }

    })
  }

  deleted(filter) {
    this._resetError();
    this._model = this._modelOrigin;
    let _this = this;
    return new Promise(async (resolve) => {
      try {
        _this._model.remove(filter, (err) => {
          let result = true;
          if (err) {
            result = false;
            _this._setError(err);
          }
          resolve(result);
        })
      } catch (error) {
        this._setError(error);
        resolve();
      }
    })
  }

  _setError(msg) {
    this.error = true;
    this.message.push(msg);
  }

  _resetError() {
    this.error = false;
    this.message = [];
  }
};