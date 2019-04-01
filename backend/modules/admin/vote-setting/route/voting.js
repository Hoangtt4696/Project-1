/**
 * @author Tran Dinh Hoang
 */

'use strict';

const path               = require('path');
const express            = require('express');
const router             = express.Router();
const VotingController   = require('../controller/voting');
const checkUserAdmin     = require(path.resolve('./middleware/check-user-admin'));

router.put('/general', checkUserAdmin, VotingController.upsertGeneralSetting);
router.get('/general', VotingController.getGeneralSetting);
router.put('/limit', checkUserAdmin, VotingController.upsertLimitSetting);
router.get('/limit', VotingController.getLimitSetting);

module.exports = router;