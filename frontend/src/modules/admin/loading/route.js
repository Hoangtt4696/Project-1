import Loading from 'modules/admin/loading/container/index'
import config from 'config/config'
const routes = [
    {
      path: config.pathAdmin + '/loading',
      component: Loading
    }
];

export default routes;