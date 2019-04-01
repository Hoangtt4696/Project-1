import dog from './actions/admin/dog'
import product from './actions/admin/product'
import { all } from 'redux-saga/effects';
import votingLimitSetting from '../actions/admin/voting-limit';
import haraWork from '../actions/admin/hara-work';
// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* watcherSaga() {
  yield all([
    ...dog,
    ...product,
    ...votingLimitSetting,
    ...haraWork,
  ])
}