import config from './default'
import configPro from './default.pro.js'
import configDev from './default.dev'
import lodash from 'lodash';
let result = config;
const hostname = window && window.location && window.location.hostname;
if (hostname.indexOf('danhgia360.onapp.haravan.com') > -1) {
  result = configPro;
} else if (hostname.indexOf('danhgia360-onapp.sku.vn') > -1) {
  result = config;
} else {
  result = lodash.defaults(configDev, config);
}
export default result;