let path = require('path');
var BaseRead = require(path.resolve('./core/model/postgre/model-read.js'));


exports.select = async (table, filter) => {
  let obj = new BaseRead(table);
  return await obj.select(filter);
}
exports.count = async (table, filter) => {
  let obj = new BaseRead(table);
  return await obj.count(filter);
}
