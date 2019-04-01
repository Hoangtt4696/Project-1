/** 
 * @author Tran Dinh Hoang
*/

'use strict';

const _ = require('lodash');

/**
 * Generate object contain function that auto create class instance and invoke class method
 * 
 * @example
 * // assume you have a class controller
 * class Controller extends BaseController {
 *  constructor(req, res, next) {
 *      super(req, res, next);
 *    }
 *  async list() {
 *     //...
 *  }
 *  
 *  async create() {
 *     //...
 *  }
 * };
 * 
 * // and want to export it's method, basically you can do :
 * exports.list = async function list(req, res) {
 *  let controller = new Controller(req, res);
 *  await controller.list()
 * }
 * 
 * exports.create = async function create(req, res) {
 *  let controller = new Controller(req, res);
 *  await controller.create()
 * }
 * 
 * // with exportClassMethod helper, just little code :
 * module.exports = exportClassMethod(Controller, [
 *   'list', 
 *   'create', 
 * ]);
 * 
 * // It will auto generate an object contain functions that auto create class instance and invoke class method
 * => module.exports = {
 *   list : function(req, res){
 *      // do something like that ...
 *      let instance = new Controller(req, res);
 *      return instance.list();
 *   },
 *   create : function(req, res){
 *      // do something like that ...
 *      let instance = new Controller(req, res);
 *      return instance.create();
 *   },
 * }
 * 
 * @param {Object}  _class   - The  class that want to export methods
 * @param {Array }  methods  - List method names or method options
 * @param {Object} [options] - maybe
 * * passArgumentsTo : 'constructor' or 'method'
 * 
 * @return {Object} contain generated function
 */
function exportClassMethod(_class, methods, options) {
  let default_options = {
    passArgumentsTo: 'constructor', // 'method'
  };

  let objExport = {};

  options = _.merge(default_options, options);

  if (Array.isArray(methods)) {
    for (let i in methods) {
      let method = methods[i];
      let method_name, func_name;
      // get method_name and function_name
      if (typeof method === 'string') {
        method_name = func_name = method;
      }
      
      if (Array.isArray(method) && method.length === 2) {
        [method_name, func_name] = method;
      }

      if (!(method_name && func_name)) {
        throw new TypeError(`The method expect a string name or pair [method name, function name], but received ${method}`);
      }
      // generate function
      objExport[func_name] = function (...args) {
        let constructor_args = [];
        let method_args = [];
        if (options.passArgumentsTo === 'constructor') {
          constructor_args = args;
        } 
        else {
          method_args = args;
        }
        let instance = new _class(...constructor_args);
        if (typeof instance[method_name] !== 'function') {
          throw new TypeError(`Class ${instance.constructor.name} don't have method ${method_name}()`);
        }
        return instance[method_name].apply(instance, method_args);
      }
    }
  }
  return objExport;
}

module.exports.exportClassMethod = exportClassMethod;