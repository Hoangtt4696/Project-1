var mongoose = require('mongoose');
let path = require('path');
let BaseModel = require(path.resolve('./core/model/mongo/base.js'));
let _ = require('lodash');
let helperBuildQuery = require(path.resolve('./helper/build-query.js'));
var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: { type: String, required: true, max: 100 },
    age: { type: Number, default: 0 },
    created_at: { type: Date, default: new Date()}
  }
);

/*
 * data : dữ liệu update - insert
 * fn : function dang call đến thực hiện (danh đễ ghi log)
 * filter: các điều kiện search
 * old_data : dữ liệu cũ trước khi update
 * option (là optionDefault dc cấu hình bên dưới): chứa các function tiền xử lý insert update (thực hiện remove hoặc gán lại dữ liệu cữ các field không được insert update )
 * do có nhiều trường hợp khác nhau nên có thể quy định để nhiều func xử lý khác
 */
//xuất mô hình
exports.model = mongoose.model('Author', AuthorSchema);
let criteria = {};
let match = {};
let group = {};



/* tien xử lý search */
exports.buildQuery = (filter, skip, limit, sort) => {
  let equalArray = ['first_name', 'age'];
  let betweenArray = ['created_at'];
  criteria = helperBuildQuery.buildFilterEqual(equalArray, filter, criteria);
  criteria = helperBuildQuery.buildFilterBetweenList(betweenArray, filter, criteria);

  return {criteria, skip, limit, sort, match, group};
}


/* tiền xử lý insert */
exports.preInsert = (data) => {
  let dataInsert = {};



  return dataInsert
}


/* tien xử lý update */
exports.preUpdate = (data, old_data) => {
  let dataUpdate = {};



  return dataUpdate
}


module.exports = _.defaults(BaseModel, module.exports);

