import { combineReducers } from 'redux'
import { dog } from './admin/dog'
import product from './admin/product'
import votingLimitSetting from './admin/voting-limit';
import selectedAdminMenuItem from './admin/admin-menu-left';
import generalSetting from './admin/setting-general';
import createVoting from './admin/create-voted';
import createVotingModal from './admin/create-vote-modal';
import haraWork from './admin/hara-work';
import votingDetails from './admin/voting-details';
import assess from './admin/assess';

const rootReducer = combineReducers({
  dog,
  ...product,
  ...generalSetting,
  ...createVoting,
  ...selectedAdminMenuItem,
  ...votingLimitSetting,
  ...haraWork,
  ...votingDetails,
  ...assess,
    ...createVotingModal,
});

export default rootReducer
