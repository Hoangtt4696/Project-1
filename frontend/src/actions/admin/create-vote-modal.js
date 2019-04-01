import { takeLatest, call, put } from 'redux-saga/effects';
import CreateVotingModel from '../../model/create-voted';
// import store from '../../store';

export const POST_VOTING_DATA = 'POST_VOTING_DATA';
export const POST_VOTING_SUCCESS = 'POST_VOTING_SUCCESS';
export const POST_VOTING_FAILURE = 'POST_VOTING_FAILURE';

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default [
  watcherPostVotingData(),
];

function* watcherPostVotingData() {
  yield takeLatest(POST_VOTING_DATA, workerPostVotingData);
}

function* workerPostVotingData(data) {
  try {
    const response = yield call(CreateVotingModel.postVoting, data.voting);

    const votingData = response.data;

    yield put({ type: POST_VOTING_SUCCESS, votingData})
  } catch (error) {
    yield put({ type: POST_VOTING_FAILURE, error})
  }
}