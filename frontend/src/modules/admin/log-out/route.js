import LogOutContainer from './container/index'
import config from '../../../config/config'
const routes = [
    {
      path: config.pathAdmin + '/log-out',
      component: LogOutContainer
    }
];

export default routes;