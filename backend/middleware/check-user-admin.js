'use strict';

const _ = require('lodash');

const ADMIN_SCOPES = ['admin', 'hr_api.admin'];

module.exports = function(req, res, next) {
  let user        = req.user;
  let isRoot      = _.get(user, 'user_info.isRoot');
  let scopes      = _.get(user, 'user_info.scope');
  let isHaveScope = _.intersection(ADMIN_SCOPES, scopes).length > 0;

  if (!isRoot && !isHaveScope) {
    return res.status(401).json({ error : true, message : ['Chỉ user admin mới có quyền thực hiện tác vụ này']});
  }
  next();
}