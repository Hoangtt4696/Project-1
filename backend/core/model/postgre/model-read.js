let path = require('path');
let connect = require(path.resolve('./connect_db/postgre.js'));
let helperObjectArray = require(path.resolve('./helper/object-array.js'));
let _ = require('lodash');


module.exports = class BaseRead {
  constructor(table) {
    this.connect = connect.getDB();
    this.table = table;
    this.db = this.connect(this.table);
  }
  async selectDetail() {

  }

  async select(filter, select = []) {
    let db;
    if (helperObjectArray.validateObject(filter)) {
      db = await this._selectWhere(filter, select)
    } else {
      db = await this._selectAll(select)
    }

    return db;
  }

  async count(filter = {}) {
    let db = await this.db.count('*').where(filter);
    let count = _.get(db, '0.count', 0)
    return parseFloat(count);
  }

  async _selectWhere(filter, select = []) {
    let db = await this.db.where(filter).select([]);
    return db;
  }

  async _selectAll(select) {
    let db = await this.connect.select(select).from(this.table);
    return db
  }
}