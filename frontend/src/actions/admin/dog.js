import { takeLatest, call, put } from 'redux-saga/effects';
import DogModel from '../../model/dog.js';

export const GET_DOG_DATA = 'GET_DOG_DATA';
export const GET_DOG_DATA_SUCCESS = 'GET_DOG_DATA_SUCCESS';
export const GET_DOG_DATA_FAILURE = 'GET_DOG_DATA_FAILURE';

export default [
  watcherDog()
];


// watcher saga: watches for actions dispatched to the store, starts worker saga
function* watcherDog() {
  yield takeLatest(GET_DOG_DATA, workerSaga);
}



// worker saga: makes the api call when watcher saga sees the action
function* workerSaga() {
  try {
    const response = yield call(DogModel.getList);
    const dog = response.data.message;

    // dispatch a success action to the store with the new dog
    yield put({ type: GET_DOG_DATA_SUCCESS, dog });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_DOG_DATA_FAILURE, error });
  }
}