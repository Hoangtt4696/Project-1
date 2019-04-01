import Home from 'modules/admin/home-page/container/index'
import config from 'config/config'
const routes = [
    {
      path: `${config.pathAdmin}/assess`,
      component: Home,
      option: {
        a: 'b'
      }
    }
];

export default routes;