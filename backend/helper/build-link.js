'use strict'
const config       = global.config;

exports.buildLinkInstallApp = function (shop) {
  var currentShop = shop || global.config.shop;
  var linkInstall = global.config.protocol + currentShop + '/admin/api/auth/?api_key=' + global.env.haravan_api_key;
  return linkInstall;
};

exports.buildAuthURL = function () {
  var auth_url = global.config.protocol + global.config.shop;
  auth_url += '/admin/oauth/authorize?';
  auth_url += 'client_id=' + global.env.haravan_api_key;
  auth_url += '&scope=' + global.env.haravan_scope;
  auth_url += '&redirect_uri=' + global.config.redirect_uri;
  auth_url += '&response_type=code';
  return auth_url;
};

exports.UploadFileURL = (file_name) =>
  `${config.upload_host.long_term.host}/${config.app.normalize_title}/${config.upload_host.long_term.export_dir}/${file_name}`;
exports.ImportFileURL = (file_name) =>
  `${config.upload_host.short_term.host}/${config.app.normalize_title}/${config.upload_host.short_term.export_dir}/${file_name}`;
exports.ExportFileURL = (file_name) =>
  `${config.upload_host.short_term.host}/${config.app.normalize_title}/${config.upload_host.short_term.export_dir}/${file_name}`;