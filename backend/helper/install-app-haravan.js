'use strict'
let crypto = require('crypto');
let request = require('request');

exports.checkSignature = (shop, timestamp, signature, code) => {
  var secret = global.env.haravan_credential_sets;
  var signer = crypto.createHmac('sha256', secret);
  var str = '';
  if (code) {
    str = 'code=' + code;
  }

  str += 'shop=' + shop + 'timestamp=' + timestamp;

  var result = signer.update(str).digest('hex');
  return result === signature;
};

exports.getNewAccessToken = function (code) {
  return new Promise((resolve, reject) => {
    var url = global.config.haravan_shop_admin_domain + "oauth/access_token";
    var headers = {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    var options = {
      url: url,
      method: 'POST',
      headers: headers,
      form: {
        'redirect_uri': global.config.redirect_uri,
        'client_id': global.env.haravan_api_key,
        'client_secret': global.env.haravan_credential_sets,
        'grant_type': 'authorization_code',
        'code': code,
      }
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        try {
          var rs = JSON.parse(body);
          if (rs.access_token) {
            resolve(rs);
          } else {
            reject('token is null');
          }
        } catch (e) {
          reject(e);
        }
      } else {
        console.log(body);
        reject(error);
      }
    });
  })


};