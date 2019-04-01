'use strict';

const express        = require('express');
const router         = express.Router();
const AuthController = require('../controller/authentication');

router.post('/hr', AuthController.authCode);
router.get('/user-info', AuthController.getUserInfo);

module.exports = router;
