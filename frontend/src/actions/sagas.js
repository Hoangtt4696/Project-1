import dog from './admin/dog'
import product from './admin/product'
import generalSetting from './admin/setting-general'
import createVoting from './admin/create-voted'
import votingLimitSetting from './admin/voting-limit';
import haraWork from './admin/hara-work';
import votingDetails from './admin/voting-details';
import createVotingModal from './admin/create-vote-modal';
import assess from './admin/assess';
import { all } from 'redux-saga/effects';
// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* watcherSaga() {
  yield all([
    ...dog,
    ...product,
    ...generalSetting,
    ...createVoting,
    ...votingLimitSetting,
    ...haraWork,
    ...votingDetails,
    ...assess,
      ...createVotingModal,
  ])
}