let path = require('path');
let Base = require(path.resolve('./core/model/postgre/base.js'));

const db = 'store'
exports.select = async (filter) => {
  return await Base.select(db, filter);
}
exports.count = async (filter) => {
  return await Base.count(db, filter);
}