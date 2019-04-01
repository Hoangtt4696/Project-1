import { takeLatest, call, put } from 'redux-saga/effects';
import AssessModel from '../../model/assess';

export const GET_VOTE_POINT_DATA = 'GET_VOTE_POINT_DATA';
export const GET_VOTE_POINT_DATA_SUCCESS = 'GET_VOTE_POINT_DATA_SUCCESS';
export const GET_VOTE_POINT_DATA_FAILURE = 'GET_VOTE_POINT_DATA_FAILURE';

export const GET_ALL_VOTE_POINT_DATA = 'GET_ALL_VOTE_POINT_DATA';
export const GET_ALL_VOTE_POINT_DATA_SUCCESS = 'GET_ALL_VOTE_POINT_DATA_SUCCESS';
export const GET_ALL_VOTE_POINT_DATA_FAILURE = 'GET_ALL_VOTE_POINT_DATA_FAILURE';

export const POST_ASSESS_DATA = 'POST_ASSESS_DATA';
export const POST_ASSESS_DATA_FAILURE = 'POST_ASSESS_DATA_FAILURE';
export const POST_ASSESS_DATA_SUCCESS = 'POST_ASSESS_DATA_SUCCESS';

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default [
  watcherGetListVotePoint(),
  watcherPutAssess(),
  watcherGetAllListVotePoint()
];

function* watcherGetAllListVotePoint() {
  yield takeLatest(GET_ALL_VOTE_POINT_DATA, workerGetAllListVotePoint)
}

function* workerGetAllListVotePoint(data) {
  try {
    const response = yield call(AssessModel.getListVotePoint, data.query);
    
    const listVotePoint = response.data.items;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_ALL_VOTE_POINT_DATA_SUCCESS, listVotePoint: listVotePoint });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_ALL_VOTE_POINT_DATA_FAILURE, error });
  }
}

function* watcherGetListVotePoint() {
  yield takeLatest(GET_VOTE_POINT_DATA, workerGetListVotePoint);
}

function* watcherPutAssess() {
  yield takeLatest(POST_ASSESS_DATA, workerPutAssess);
}

// worker saga: makes the api call when watcher saga sees the action
function* workerGetListVotePoint(query) {
  try {
    const response = yield call(AssessModel.getListVotePoint, query.query);
    
    const listVotePoint = response.data.items;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_VOTE_POINT_DATA_SUCCESS, listVotePoint: listVotePoint });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_VOTE_POINT_DATA_FAILURE, error });
  }
}

function* workerPutAssess(data) {
  try {
    const response = yield call(AssessModel.postAssess, data.data);
    
    const listVotePoint = response.data;

    yield put({ type: POST_ASSESS_DATA_SUCCESS, listVotePoint: listVotePoint})
  } catch (error) {
    yield put({ type: POST_ASSESS_DATA_FAILURE, error})
  }
}