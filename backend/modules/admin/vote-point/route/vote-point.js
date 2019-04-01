'use strict';

const path           = require('path');
const express        = require('express');
const router         = express.Router();
const ControllerVotePoint = require('../../vote-point/controller/vote-point');
const checkUserAdmin = require(path.resolve('./middleware/check-user-admin'));

router.post('/', ControllerVotePoint.create);
router.get('/', ControllerVotePoint.list);
// router.route('/:id')
//       .put(checkUserAdmin, ControllerVote.update)
//       .delete(checkUserAdmin, ControllerVote.delete)
//       .get(ControllerVote.detail);
// router.param('id', ControllerVote.detailVoteById);

module.exports = router;