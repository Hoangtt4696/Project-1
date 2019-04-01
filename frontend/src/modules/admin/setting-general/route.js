import SettingGeneralContainer from './container/index.js'
import config from 'config/config';

const routes = [
    {
      path: config.pathAdmin + '/setting-general',
      component: SettingGeneralContainer
    }
];

export default routes;