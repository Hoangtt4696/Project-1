'use strict';
let path = require('path');

const config                = require('../config');
const CronJob               = require('cron').CronJob;
const UpdateSalaryBonusCron = require(path.resolve('./lib/crons/update-salary-bonus.js'));

let UpdateSalaryBonusJob = new CronJob({
  cronTime: config.cron_time.update_salary_bonus,
  onTick: function() {
    if (!global.UpdateSalaryBonus) {
      global.UpdateSalaryBonus = true;

      UpdateSalaryBonusCron.start(function() {
        global.UpdateSalaryBonus = false;
      });
    }
  },
  start: false
});

module.exports.start = function() {
  if (config.cron_active.update_salary_bonus) {
    UpdateSalaryBonusJob.start();
  }
}