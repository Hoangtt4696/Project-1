import Loadable from 'react-loadable';
import Loading from '../loading';

const routes = [
  { path: "/products", component: Loadable({ loader: () => import('./container/index'), loading: Loading, }) },
  { path: "/products/:id", component: Loadable({ loader: () => import('./container/detail'), loading: Loading, }) }
];

export default routes;