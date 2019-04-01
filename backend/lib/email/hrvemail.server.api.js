'use strict';

const request = require('request');
const swig    = require('swig');
const config  = global.config;
const _       = require('lodash');
const path    = require('path');
const toResolve = require(path.resolve('./helper/lang')).toResolve;

let EmailAPI = {};

EmailAPI.emailFixYahoo = (email) => {
  var newemail = email;
  if (email && email !== '') {
    if (email.indexOf('+') !== -1 && email.indexOf('yahoo') !== -1) {
      var tmp = email.split('@');
      var tmp2 = tmp[0].split('+');
      newemail = tmp2[0] + '@' + tmp[1];
    }
  }
  return newemail;
};

EmailAPI.sendmail = (FromName, FromAddress, ToName, ToAddress, Subject, EmailBody, callback) => {
  //var self = this;
  try {
    var mailerurl = global.config.mailer.options.service; //POST http://42.117.4.245:9000/mailer
    FromName = FromName || '';
    FromAddress = FromAddress || '';
    ToName = ToName || '';
    ToAddress = ToAddress || '';
    Subject = Subject || '';
    EmailBody = EmailBody || '';

    FromAddress = EmailAPI.emailFixYahoo(FromAddress);
    ToAddress = EmailAPI.emailFixYahoo(ToAddress);

    var postData = {
      'IsHtmlBody': true,
      'MailType': 0,
      'From': {
        'Address': FromAddress,
        'DisplayName': FromName
      },
      'To': [{
        'Address': ToAddress,
        'DisplayName': ToName
      }],
      'CC': null,
      'BCC': null,
      'Subject': Subject,
      'Body': EmailBody,
      'AttachFileUrls': null,
      'Action': 100,
      'EventTypes': []
    };

    var bodyData = JSON.stringify(postData);
    var options = {
      url: mailerurl,
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Content-Length': new Buffer(bodyData).length
      },
      body: bodyData
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        if (callback) {
          callback(null, body);
        }
      } else {
        if (callback) {
          callback(error);
        }
      }
    });
  } catch (e) {
    if (callback) {
      callback();
    }
  }
}

EmailAPI.sendEmailWithTemplate = async function(dataInfo, templateFilePath){
  var FromName        = config.app.title;
  var FromAddress     = config.mailer.from;
  var ToName          = dataInfo.user.name;
  var ToAddress       = dataInfo.user.email;
  var Subject         = dataInfo.subjectType;
  
  var viewData = {
    ToName        : ToName,
    appTitle      : config.app.title,
  };

  viewData = _.merge(viewData, dataInfo);
  var template = swig.compileFile(templateFilePath);
  var EmailBody = template(viewData);

  let [err, data] = await toResolve(EmailAPI.sendmail)(FromName, FromAddress, ToName, ToAddress, Subject, EmailBody);
  if (err) {
    throw err;
  }
};

module.exports = EmailAPI;