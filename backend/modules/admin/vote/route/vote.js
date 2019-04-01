'use strict';

const path           = require('path');
const express        = require('express');
const router         = express.Router();
const ControllerVote = require('../controller/vote');
const checkUserAdmin = require(path.resolve('./middleware/check-user-admin'));

router.post('/', checkUserAdmin, ControllerVote.create);
router.get('/', ControllerVote.list);
router.get('/export', ControllerVote.exportVoteResults);
router.route('/:id')
      .put(checkUserAdmin, ControllerVote.update)
      .delete(checkUserAdmin, ControllerVote.delete)
      .get(ControllerVote.detail);

router.get('/:id/export', ControllerVote.exportVoteResult);

router.put('/:id/activate', ControllerVote.activate);
router.put('/:id/deactivate', ControllerVote.deactivate);
router.put('/:id/submit', ControllerVote.submitResult);
router.param('id', ControllerVote.detailVoteById);
module.exports = router;