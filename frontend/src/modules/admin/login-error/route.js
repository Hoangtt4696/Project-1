import LoginErrorContainer from './container/index'
import config from '../../../config/config'

const routes = [
    {
      path: config.pathAdmin + '/login-error',
      component: LoginErrorContainer
    }
];

export default routes;