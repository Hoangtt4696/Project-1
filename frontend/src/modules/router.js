import adminCreateVoted from './admin/create-voted/route.js'
import adminVotingDetails from './admin/voting-details/route.js'
import adminSettingGeneral from './admin/setting-general/route.js'
import adminVotingLimit from './admin/voting-limit/route.js'
import adminAssess from './admin/assess/route.js'
import adminHome from 'modules/admin/home-page/route.js'
import adminLoading from 'modules/admin/loading/route.js'
import adminLogout from 'modules/admin/log-out/route.js'
import adminLoginError from 'modules/admin/login-error/route.js'


const routes = [
    ...adminLogout,
    ...adminLoading,
    ...adminCreateVoted,
    ...adminVotingDetails,
    ...adminSettingGeneral,
    ...adminVotingLimit,
    ...adminAssess,
    ...adminHome,
    ...adminLoginError
];

export default routes;