import { takeLatest, call, put } from 'redux-saga/effects';
import GeneralSettingModel from '../../model/setting-general';

export const GET_GENERAL_SETTING_DATA = 'GET_GENERAL_SETTING_DATA';
export const GET_GENERAL_SETTING_DATA_SUCCESS = 'GET_GENERAL_SETTING_DATA_SUCCESS';
export const GET_GENERAL_SETTING_DATA_FAILURE = 'GET_GENERAL_SETTING_DATA_FAILURE';

export const PUT_GENERAL_SETTING_DATA = 'PUT_GENERAL_SETTING_DATA';
export const PUT_GENERAL_SETTING_DATA_FAILURE = 'PUT_GENERAL_SETTING_DATA_FAILURE';
export const PUT_GENERAL_SETTING_DATA_SUCCESS = 'PUT_GENERAL_SETTING_DATA_SUCCESS';

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default [
  watcherGetGeneralSetting(),
  watcherPutGeneralSetting()
];

function* watcherGetGeneralSetting() {
  yield takeLatest(GET_GENERAL_SETTING_DATA, workerGetGeneralSetting);
}

function* watcherPutGeneralSetting() {
  yield takeLatest(PUT_GENERAL_SETTING_DATA, workerPutGeneralSetting);
}

// worker saga: makes the api call when watcher saga sees the action
function* workerGetGeneralSetting() {
  try {
    const response = yield call(GeneralSettingModel.getSetting);
    
    const settings = response.data;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_GENERAL_SETTING_DATA_SUCCESS, generalSetting: settings });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_GENERAL_SETTING_DATA_FAILURE, error });
  }
}

function* workerPutGeneralSetting(data) {
  try {
    const response = yield call(GeneralSettingModel.putSetting, data.settings);
    
    const settings = response;

    yield put({ type: PUT_GENERAL_SETTING_DATA_SUCCESS, generalSetting: settings})
  } catch (error) {
    yield put({ type: PUT_GENERAL_SETTING_DATA_FAILURE, error})
  }
}