'use strict'
var createError = require('http-errors');

var adminUsersRouter           = require('./modules/admin/user/route/users');
var adminAuthRouter            = require('./modules/admin/authentication/route/authentication');
var adminHaraWorkRouter        = require('./modules/admin/hara-work/route/hara-work');
var adminRouterVote            = require('./modules/admin/vote/route/vote');
var adminVotingSettingRouter   = require('./modules/admin/vote-setting/route/voting');
var adminVotePointRouter       = require('./modules/admin/vote-point/route/vote-point');
var SiteRoute                  = require('./modules/admin/site/route/index');

function initRouteModule(app) {

  /* 
  * Admin module
  */
  app.use(`/${global.config.module}users`, adminUsersRouter);
  app.use(`/${global.config.moduleAdmin}vote`, adminRouterVote);
  app.use(`/${global.config.moduleAdmin}vote-point`, adminVotePointRouter);
  app.use(`/${global.config.moduleAdmin}authentication`, adminAuthRouter);
  app.use(`/${global.config.moduleAdmin}hara-work`, adminHaraWorkRouter);
  app.use(`/${global.config.moduleAdmin}vote/setting`, adminVotingSettingRouter);

  // fake oes callback url
  app.use(`/${process.env.OES_PREFIX}authentication`, adminAuthRouter);
  app.use('/', SiteRoute);
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

}


module.exports = initRouteModule;
