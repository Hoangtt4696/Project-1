import { takeLatest, call, put } from 'redux-saga/effects';
import VotingDetailsModel from '../../model/voting-details';

export const GET_VOTING_DETAILS = 'GET_VOTING_DETAILS';
export const GET_VOTING_DETAILS_SUCCESS = 'GET_VOTING_DETAILS_SUCCESS';
export const GET_VOTING_DETAILS_FAILURE = 'GET_VOTING_DETAILS_FAILURE';

export const POST_VOTING_DETAILS = 'POST_VOTING_DETAILS';
export const POST_VOTING_DETAILS_SUCCESS = 'POST_VOTING_DETAILS_SUCCESS';
export const POST_VOTING_DETAILS_FAILURE = 'POST_VOTING_DETAILS_FAILURE';

export const PUT_VOTING_DETAILS = 'PUT_VOTING_DETAILS';
export const PUT_VOTING_DETAILS_SUCCESS = 'PUT_VOTING_DETAILS_SUCCESS';
export const PUT_VOTING_DETAILS_FAILURE = 'PUT_VOTING_DETAILS_FAILURE';

export const SET_VOTING_ACTIVE = 'SET_VOTING_ACTIVE';
export const SET_VOTING_ACTIVE_SUCCESS = 'SET_VOTING_ACTIVE_SUCCESS';
export const SET_VOTING_ACTIVE_FAILURE = 'SET_VOTING_ACTIVE_FAILURE';

export const GET_EXPORT = 'GET_EXPORT';
export const GET_EXPORT_SUCCESS = 'GET_EXPORT_SUCCESS';
export const GET_EXPORT_FAILURE = 'GET_EXPORT_FAILURE';

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default [
  watcherGetVotingDetails(),
  // watcherPostVotingDetails(),
  watcherPutVotingDetails(),
  watcherSetVotingActive(),
  watcherGetExport()
];

function* watcherGetExport() {
  yield takeLatest(GET_EXPORT, workerGetExport);
}

function* workerGetExport(data) {
  try {
    yield call(VotingDetailsModel.exportResult, data.id);

    // dispatch a success action to the store with the new product
    yield put({ type: GET_EXPORT_SUCCESS });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_EXPORT_FAILURE, error });
  }
}

function* watcherGetVotingDetails(){
  yield takeLatest(GET_VOTING_DETAILS, workerGetVotingDetails);
}

// function* watcherPostVotingDetails(){
//   yield takeLatest(POST_VOTING_DETAILS, workerPostVotingDetails);
// }

function* watcherPutVotingDetails(){
  yield takeLatest(PUT_VOTING_DETAILS, workerPutVotingDetails);
}

function* watcherSetVotingActive(){
  yield takeLatest(SET_VOTING_ACTIVE, workerSetVotingActive);
}

function* workerGetVotingDetails(id) {
  try {
    const response = yield call(VotingDetailsModel.getVotingDetails, id);
    
    const votingDetails = response.data;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_VOTING_DETAILS_SUCCESS, votingDetails });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_VOTING_DETAILS_FAILURE, error });
  }
}

// function* workerPostVotingDetails(postData, id) {
//   try {
//     const response = yield call(VotingDetailsModel.postVotingDetails, postData);
    
//     const votingDetails = response.data;

//     // dispatch a success action to the store with the new product
//     yield put({ type: POST_VOTING_DETAILS_SUCCESS, votingDetails });
  
//   } catch (error) {
//     // dispatch a failure action to the store with the error
//     yield put({ type: POST_VOTING_DETAILS_FAILURE, error });
//   }
// }

function* workerPutVotingDetails(data) {
  try {
    const response = yield call(VotingDetailsModel.putVotingDetails, {data: data.data.data, id: data.data.id});
    
    const votingDetails = response.data;

    // dispatch a success action to the store with the new product
    yield put({ type: PUT_VOTING_DETAILS_SUCCESS, votingDetails });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: PUT_VOTING_DETAILS_FAILURE, error });
  }
}

function* workerSetVotingActive(data) {
  try {
    const response = yield call(VotingDetailsModel.setVotingActive, data);
    
    const votingData = response.data;
    // dispatch a success action to the store with the new product
    yield put({ type: SET_VOTING_ACTIVE_SUCCESS, votingData });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: SET_VOTING_ACTIVE_FAILURE, error });
  }
}