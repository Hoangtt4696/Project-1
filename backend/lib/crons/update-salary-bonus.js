/**
 * @author Tran Dinh Hoang
 */

'use strict';

const path = require('path');
const UpdateSalaryBusiness = require(path.resolve('./modules/admin/stores/business/update-salary'));

module.exports.start = cb => {
  let now       = new Date();
  let yesterday = now.setDate(now.getDate() - 1);
  let bus       = new UpdateSalaryBusiness();
  bus.start(yesterday).then(cb);
};