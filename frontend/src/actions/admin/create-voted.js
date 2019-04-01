import { takeLatest, call, put, takeEvery } from 'redux-saga/effects';
import CreateVotingModel from '../../model/create-voted';
// import store from '../../store';

export const GET_VOTING_DATA = 'GET_VOTING_DATA';
export const GET_VOTING_DATA_PERIOD_BASED = 'GET_VOTING_DATA_PERIOD_BASED';
export const GET_VOTING_DATA_PERIOD_BASED_PAGINATION = 'GET_VOTING_DATA_PERIOD_BASED_PAGINATION';
export const GET_VOTING_DATA_FAILURE = 'GET_VOTING_DATA_FAILURE';
export const GET_VOTING_DATA_SUCCESS = 'GET_VOTING_DATA_SUCCESS';


export const SET_VOTING_STATUS = 'SET_VOTING_STATUS';
export const SET_VOTING_STATUS_SUCCESS = 'SET_VOTING_STATUS_SUCCESS';
export const SET_VOTING_STATUS_FAILURE = 'SET_VOTING_STATUS_FAILURE';

export const PUT_VOTING_DATA = 'PUT_VOTING_DATA';
export const PUT_VOTING_DATA_SUCCESS = 'PUT_VOTING_DATA_SUCCESS';
export const PUT_VOTING_DATA_FAILURE = 'PUT_VOTING_DATA_FAILURE';

export const PUT_SUBMIT_RESULT = 'PUT_SUBMIT_RESULT';
export const PUT_SUBMIT_RESULT_SUCCESS = 'PUT_SUBMIT_RESULT_SUCCESS';
export const PUT_SUBMIT_RESULT_FAILURE = 'PUT_SUBMIT_RESULT_FAILURE';

export const CHANGE_STATE_JUSTUPDATE = 'CHANGE_STATE_JUSTUPDATE';
export const CHANGE_STATE_JUSTUPDATE_SUCCESS = 'CHANGE_STATE_JUSTUPDATE_SUCCESS';

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default [
  watcherGetVotingData(),
  watcherGetVotingDataPeriodBased(),
  watcherSetVotingStatus(),
  watcherPutVotingData(),
  watcherSubmitResult(),
  watcherGetVotingDataPeriodBasedPagination(),
  watcherChangeStateJustUpdate()
];

function* watcherChangeStateJustUpdate() {
  yield takeLatest(CHANGE_STATE_JUSTUPDATE, workerChangeStateJustUpdate)
}

function* workerChangeStateJustUpdate() {
  yield put({type: CHANGE_STATE_JUSTUPDATE_SUCCESS})
}

function* watcherGetVotingDataPeriodBasedPagination(){
  yield takeLatest(GET_VOTING_DATA_PERIOD_BASED_PAGINATION, workerGetVotingDataPeriodBasedPagination)
}

function* workerGetVotingDataPeriodBasedPagination(data){
  try {
    const response = yield call(CreateVotingModel.getVotingPeriodBasedPagination, {period: data.data.period, page: data.data.page, limit: data.data.limit});
    const votingData = response.data;
    // dispatch a success action to the store with the new product
    yield put({ type: GET_VOTING_DATA_SUCCESS, votingData});
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_VOTING_DATA_FAILURE, error });
  }
}

function* watcherSubmitResult() {
  yield takeEvery(PUT_SUBMIT_RESULT, workerSubmitResult);
}

function* watcherGetVotingData() {
  yield takeLatest(GET_VOTING_DATA, workerGetVotingData);
}

function* watcherGetVotingDataPeriodBased() {
  yield takeLatest(GET_VOTING_DATA_PERIOD_BASED, workerGetVotingDataPeriodBased);
}

function* watcherSetVotingStatus() {
  yield takeEvery(SET_VOTING_STATUS, workerSetVotingStatus);
}

function* watcherPutVotingData() {
  yield takeLatest(PUT_VOTING_DATA, workerPutVotingData);
}

function* workerSubmitResult(data) {
  try {
    const response = yield call(CreateVotingModel.submitResult, data.id);

    // dispatch a success action to the store with the new product
    yield put({ type: PUT_SUBMIT_RESULT_SUCCESS, id: response.data.id });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: PUT_SUBMIT_RESULT_FAILURE, error });
  }
}

// worker saga: makes the api call when watcher saga sees the action
function* workerGetVotingData() {
  try {
    const response = yield call(CreateVotingModel.getVoting);
    
    const votingData = response.data;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_VOTING_DATA_SUCCESS, votingData });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_VOTING_DATA_FAILURE, error });
  }
}

function* workerGetVotingDataPeriodBased(period) {
  try {
    const response = yield call(CreateVotingModel.getVotingPeriodBased, period.period);
    
    const votingData = response.data;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_VOTING_DATA_SUCCESS, votingData });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_VOTING_DATA_FAILURE, error });
  }
}

function* workerSetVotingStatus(dt) {
  try {
    // const status = yield select(state => state.votingData.items).find(v => v._id === id.id).activate;
    // const status = store.getState().votingData.find(v => v.id === id).status;
    const response = yield call(CreateVotingModel.putVoting, {id: dt.data.id, status: dt.data.status});

    const votingData = response.data

    yield put({ type: SET_VOTING_STATUS_SUCCESS, votingData});
  } catch (error) {
    yield put({ type: SET_VOTING_STATUS_FAILURE, error})
  }
}

function* workerPutVotingData(data) {
  try {
    const response = yield call(CreateVotingModel.putVoting, data.voting);

    const votingData = response.data;

    yield put({ type: PUT_VOTING_DATA_SUCCESS, votingData})
  } catch (error) {
    yield put({ type: PUT_VOTING_DATA_FAILURE, error})
  }
}