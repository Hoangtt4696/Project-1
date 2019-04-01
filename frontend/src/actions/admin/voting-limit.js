import { takeLatest, call, put } from 'redux-saga/effects';
import VotingLimitModel from '../../model/voting-limit';

export const GET_VOTING_LIMIT_DETAIL = 'GET_VOTING_LIMIT_DETAIL';
export const GET_VOTING_LIMIT_DETAIL_SUCCESS = 'GET_VOTING_LIMIT_DETAIL_SUCCESS';
export const GET_VOTING_LIMIT_DETAIL_FAILURE = 'GET_VOTING_LIMIT_DETAIL_FAILURE';

export const POST_VOTING_LIMIT = 'POST_VOTING_LIMIT';
export const POST_VOTING_LIMIT_SUCCESS = 'POST_VOTING_LIMIT_SUCCESS';
export const POST_VOTING_LIMIT_FAILURE = 'POST_VOTING_LIMIT_FAILURE';
// watcher saga: watches for actions dispatched to the store, starts worker saga
export default [
  watcherVotingLimitDetail(),
  watcherPostVotingLimit(),
];

function* watcherVotingLimitDetail() {
  yield takeLatest(GET_VOTING_LIMIT_DETAIL, workerVotingLimitDetail);
}

function* workerVotingLimitDetail() {
  try {
    const response = yield call(VotingLimitModel.getDetail);
    const votingLimit = response.data;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_VOTING_LIMIT_DETAIL_SUCCESS, votingLimit });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_VOTING_LIMIT_DETAIL_FAILURE, error });
  }
}

function* watcherPostVotingLimit() {
  yield takeLatest(POST_VOTING_LIMIT, workerPostVotingLimit);
}

function* workerPostVotingLimit(data) {
  try {
    const response = yield call(VotingLimitModel.putVoting, data.votingLimit);
    const votingLimit = response.data;
    
    yield put({ type: POST_VOTING_LIMIT_SUCCESS, votingLimit });
  } catch (error) {
    yield put({ type: POST_VOTING_LIMIT_FAILURE, error });
  }
}