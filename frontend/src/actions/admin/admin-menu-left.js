import { takeLatest, put } from 'redux-saga/effects';

export const ACTION_SELECT_MENU_ITEM = 'ACTION_SELECT_MENU_ITEM';

export default [
  watcherSelectMenuItem()
]

function* watcherSelectMenuItem() {
  yield takeLatest(ACTION_SELECT_MENU_ITEM, workerSelectMenuItem);
}

function* workerSelectMenuItem(item) {
  yield put(ACTION_SELECT_MENU_ITEM, item)
}