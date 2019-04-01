var express = require('express');
var router = express.Router();
let path = require('path')
let indexController = require(path.resolve('./modules/admin/site/controller/index.js'));

/* GET home page. */
router.get('/site*', indexController.loadSite);

module.exports = router;
