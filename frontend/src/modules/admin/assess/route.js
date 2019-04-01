import AssessContainer from './container/index.js'
import config from 'config/config';

const routes = [
    {
      path: config.pathAdmin + '/assess',
      component: AssessContainer
    }
];

export default routes;