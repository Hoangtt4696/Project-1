'use strict';

const _      = require('lodash');
const config = global.config;

let callAPI = {};

module.exports = callAPI;

callAPI.HR_SHOP_DETAIL = {
  pre_send : configHaravanAPI,
  url: 'shop.json',
  method: 'get',
};

callAPI.HR_PRODUCT_LIST = {
  pre_send : configHaravanAPI,
  url: 'products.json',
  method: 'get',
  data: {
    page: 1,
    limit: 20,
    query: 'xoai',
    fields: 'id,handle,published_at,published_scope,created_at,updated_at,product_type,title,vendor,tags,images,image,options,variants'
  }
};

callAPI.HR_PRODUCT_COUNT = {
  pre_send : configHaravanAPI,
  url: 'products/count.json',
  method: 'get',
  data: {
    query: 'xoai'
  }
};

callAPI.HR_OEDER_DETAIL = {
  pre_send : configHaravanAPI,
  url: 'orders/{order_id}.json',
  method: 'get',
  url_args: { order_id: 1000214304 },
};

callAPI.HR_OEDER_CREATE = {
  pre_send : configHaravanAPI,
  url: 'orders.json',
  method: 'post',
  data: { order: {} }
};

// transfer -------------------
callAPI.HR_TRANSFER_CREATE = {
  pre_send : configHaravanAPI,
  url: 'inventories/transfer.json',
  method: 'post',
  data: {
    transfer: {
      'from_loc_id': 479749,
      'to_loc_id': 479754,
      'note': 'xdadada',
      'reason': 'transfer',
      'received_at': '2017-06-09T17:00:00Z',
      'user_id': 3,
      'line_items': [
        {
          'product_id': 10000260270,
          'product_variant_id': 101021136,
          'quantity': 1
        }
      ]
    }
  }
};

callAPI.HR_TRANSFER_RECEIVE = {
  pre_send : configHaravanAPI,
  url: 'inventories/transfer/{transfer.id}/receive.json',
  method: 'post',
  data: {
    transfer: {
      id: 100035,
      user_id: 1000113120,
    }
  },
  url_args : {
    id : 100035,
  }
};

callAPI.HR_LIST_CARRIER = {
  pre_send : configHaravanAPI,
  url: 'carrier_services.json',
  method: 'get'
};

callAPI.HR_LIST_CARRIER_PACKAGES = {
  pre_send : configHaravanAPI,
  url: 'carrier_services/{carrier_id}/shipping_fees.json',
  method: 'get',
  params: {
    location_id: 1012342,
    to_district_code: 'HCM',
    total_weight: 1000,
    cod_amount: 500000
  },
  url_args : {
    carrier_id: 11,
  }
};

callAPI.HR_USER_DETAIL = {
  pre_send : configHaravanAPI,
  url: 'users.json',
  method: 'get'
}

//----------------------------- Static file -------------------------------
callAPI.HR_UPLOAD_FILE = {
  method  : 'post',
  baseURL : config.upload_host.long_term.host,
  url     : `${config.app.normalize_title}/${config.upload_host.long_term.upload_dir}/{file_name}`,
  headers: {
    'Authorization': config.upload_host.long_term.auth,
  },
  data    : 'Binary buffer data',
};

callAPI.HR_DELETE_UPLOAD_FILE = {
  method  : 'delete',
  baseURL : config.upload_host.long_term.host,
  url     : `${config.app.normalize_title}/${config.upload_host.long_term.upload_dir}/{file_name}`,
  headers: {
    'Authorization': config.upload_host.long_term.auth,
  },
};

callAPI.HR_IMPORT_FILE = {
  method  : 'post',
  baseURL : config.upload_host.short_term.host,
  url     : `${config.app.normalize_title}/${config.upload_host.short_term.import_dir}/{file_name}`,
  headers: {
    'Authorization': config.upload_host.short_term.auth,
  },
  data    : 'Binary buffer data',
}

callAPI.HR_EXPORT_FILE = {
  method  : 'post',
  baseURL : config.upload_host.short_term.host,
  url     : `${config.app.normalize_title}/${config.upload_host.short_term.export_dir}/{file_name}`,
  headers: {
    'Authorization': config.upload_host.short_term.auth,
  },
  data    : 'Binary buffer data',
}

//------------------------------- middleware -----------------------------------
function configHaravanAPI(api, options, user) {
  options.baseURL = global.config.haravan_shop_admin_domain;
  if (!api.allow_empty_token) {
    options.headers.Authorization = 'Bearer ' + _.get(user, 'access_token', '');
  }
}