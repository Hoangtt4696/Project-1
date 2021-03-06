'use strict';

const _              = require('lodash');
const path           = require('path');
const helperJwt      = require(path.resolve('./helper/jwt'));
// const mongoose       = require('mongoose');
// const UserToken      = mongoose.model('User_token');
const UserTokenQuery = require(path.resolve('./modules/admin/user/model/user-token'));
const BaseBusiness   = require(path.resolve('./core/business/base'));

module.exports = class UserTokenUpdate extends BaseBusiness {
  constructor(user) {
    super();
    this._user   = user;
    this.result  = null;
    this.data    = null;
    this.expired = 0;
  }

  async updateLogin() {
    let [token, expried] = helperJwt.genJwtToken(this._user);
    return await UserTokenQuery.updated(
      {
        orgid        : this._user.orgid,
        user_id      : this._user.id,
        token        : token,
        status       : UserTokenQuery.model.STATUS_ACTIVE,
        expired_at   : expried, 
        updated_at   : Date.now(),
      },
      { orgid : this._user.orgid, user_id: this._user.id }, 
      null, null, true
    );
  }

  async updateLogout() {
    await UserTokenQuery.deleted({ orgid : this._user.orgid, user_id: this._user.id });
  }

  async updateModify() {
    if (_.isObjectLike(this._user)) {
      await UserTokenQuery.updatedMulti({status: UserTokenQuery.model.STATUS_HAS_MODIFY}, {
        orgid : this._user.orgid,
        user_id : this._user.id,
      });
    }
  }
};
