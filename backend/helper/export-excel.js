/**
 * @author Tran Dinh Hoang
 */

const _            = require('lodash');
const path         = require('path');
const fs           = require('fs');
const lang         = require('./lang');
const readFile     = lang.toResolve(fs.readFile);
const XlsxTemplate = require('xlsx-template');
const callAPI      = require(path.resolve('./helper/call-api'));

module.exports     = exportExcel;

/**
 * Export excel
 * @param {Object|Array} data               data will export
 * @param {String}       templateFile       absolute template file path
 * @param {String}       outputFile         output file name
 * @param {Object}       options            options
 * @param {Boolean}      options.multiSheet export excel have multi sheet. default is false \
 * if true, data must be an array of sheet info : \
 * ``` [{ sheet_number : 1, sheet_data : {} }] ```
 * 
 * @return {Object} Error object, may be invalid params, filesystem exception.
 * @handling        Should crash app if error exists
 * @see [xlsx-template](https://www.npmjs.com/package/xlsx-template) guide for write template file
 * 
 * @example
 * ```js
 * const path      = require('path');
 * const uuidV4    = require('uuid/v4');
 * const buildLink = require(path.resolve('./helper/build-link'));
 * 
 * setTimeout(async ()=> {
 *   let data   = {
 *     users : [
 *       {
 *         id       : 10001,
 *         username : 'hoang',
 *         email    : 'hoang@gmail.com',
 *         address  : 'Phan Thiet, Binh Thuan'
 *       },
 *       {
 *         id       : 10002,
 *         username : 'lan',
 *         email    : 'lan@gmail.com',
 *         address  : 'Quan 1, Ho Chi Minh'
 *       }
 *     ]
 *   };
 *   
 *   let templateFile = path.resolve('./modules/admin/user/templates/export-list-user.xlsx');
 *   let outputFile   = `list-user-${uuidV4()}.xlsx`;
 *   let exportError  = await exportExcel(data, templateFile, outputFile);
 *   if (exportError) {
 *     return console.log(`Có lỗi xảy ra khi xuất file, chi tiết : ${exportError.message}`);
 *   }
 *   console.log(`Export file successfully to url : ${buildLink.ExportFileURL(outputFile)}`);
 * }, 10000);
 * ```
 */
async function exportExcel(data, templateFile, outputFile, options) {
  try {
    let default_options = {
      multiSheet : false,
    };
    options = _.merge(default_options, options);
  
    // Load an template file into memory
    let [readError, templateData] = await readFile(templateFile);
    if (readError) {
      readError.message = 'Read template file failed: ' + readError.message;
      throw readError;
    }
  
    // Create a template
    let template = new XlsxTemplate(templateData);
  
    // Multi sheet substitution 
    if (options.multiSheet) {
      if (!Array.isArray(data)) {
        throw new TypeError(`Data param in multiSheet mode expect an array, but received ${data}`);
      }
      for (let i in data) {
        let sheet = data[i];
        template.substitute(sheet.sheet_number, sheet.sheet_data);
      }
    }
    // Single sheet substitution
    else {
      if (typeof data !== 'object') {
        throw new TypeError(`Data param expect an object, but received ${data}`);
      }
      template.substitute(1, data);
    }
  
    // Get excel data
    let excelData = template.generate();
    
    // Write binary data to output file
    let sendData = Buffer.from(excelData, 'binary');
    let [err, res] = await callAPI(callAPI.HR_EXPORT_FILE, {
      url_args : { file_name : outputFile },
      data     : sendData,
    });
    if (err) {
      err.message = 'Create output file failed : ' + err.message;
      throw err;
    }
  }
  catch (err) {
    return err;
  }
}