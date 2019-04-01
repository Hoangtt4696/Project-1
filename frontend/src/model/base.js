import axios from 'axios'
import config from 'config/config'
import lodash from 'lodash'
const token = localStorage.getItem('AccessToken');
let data = {};
let url = {};
let method = '';
export const HEADER_FORMDATA = 'application/x-www-form-urlencoded';

function getBaseUrl(url) {
  if (url.indexOf('http') === -1) {
    url = config.backend_url + url;
  }

  return url;
}

let instance = axios.create({
  headers: {
    'AccessToken': token,
    'Content-Type': 'application/json; charset=utf-8',
  },
});


const make = (suc, err, fin) => {
  let obj = {
    method: method,
    url: getBaseUrl(url)
  };
  if (method === 'get'){
    obj.params = data;
  } else {
    obj.data = data;
  }
  instance(obj)
    .then(function (response) {
      if (suc) {
        suc(response)
      }
    })
    .catch(function (error, data) {
      let status = lodash.get(error, 'response.status', 0);
      if (status === 401) {
        window.location.href = config.buildLoginHrUrl
      }
      // handle error
      if (err) {
        err(error.response);
      }
    })
    .then(function () {
      if (fin) {
        fin();
      }
    });
};

const setData = (urlMake, dataMake, methodMake) => {
  data = urlMake;
  url = dataMake;
  method = methodMake;
};

const getData = (url, data, suc, err, fin) => {
  setData(data, url, 'get');
  make(suc, err, fin);
};

const postData = (url, data, suc, err, fin) => {
  setData(data, url, 'post');
  make(suc, err, fin);
};

const putData = (url, data, suc, err, fin) => {
  setData(data, url, 'put');
  make(suc, err, fin);
};

const deleteData = (url, data, suc, err, fin) => {
  setData(data, url, 'delete');
  make(suc, err, fin);
};
const updateToken = (token) => {
  instance = axios.create({
    timeout: 30000,
    headers: {
      'AccessToken': token,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
export default {
  'updateToken': updateToken,
  'get': getData,
  'post': postData,
  'put': putData,
  'delete': deleteData,
}