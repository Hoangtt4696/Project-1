import VotingDetailsContainer from './container/index.js'
import config from 'config/config';
const routes = [
    {
      path: config.pathAdmin + '/voting-details/:id',
      component: VotingDetailsContainer,
      data: {
        menuText: 'Chi tiết cuộc bình chọn',
        menuLevel: 0,
        menuParent: 0,
        role: [],
        module: '' 
      }
    }
];
export default routes;