/**
 * @requires  module:path
 */
let path = require('path');
const helperClass = require(path.resolve('./helper/class'));
const BaseController          = require(path.resolve('./core/controller/base'));

/**
* this is Admin User Class
* @class Admin User Class
*/
class SiteController extends BaseController {
  constructor(req, res, next) {
    super(req, res, next);
  }
  /**
    * PRIVATE
    * Nhận router index 2
    * @param  {object} req
    * @param  {object} res
    * @returns {object} res: status code and data
    */
  async loadSite() {
    this._res.sendFile(path.resolve('./public/build/index.html'));
  }
}
module.exports = helperClass.exportClassMethod(SiteController, [
  'loadSite'
]);