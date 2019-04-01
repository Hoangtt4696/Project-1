import CreateVotedContainer from './container/index.js'
import config from 'config/config';

const routes = [
    {
      path: config.pathAdmin + '/create-voted',
      component: CreateVotedContainer
    }
];

export default routes;