import VoitingLimitContainer from './container/index.js'
import config from 'config/config';

const routes = [
    {
      path: config.pathAdmin + '/voting-limit',
      component: VoitingLimitContainer
    }
];

export default routes;