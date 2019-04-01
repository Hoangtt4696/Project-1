import { takeLatest, call, put } from "redux-saga/effects";
import ProductModel from "../../model/product";

export const GET_PRODUCT_DATA = "GET_PRODUCT_DATA";
export const GET_PRODUCT_DATA_SUCCESS = "GET_PRODUCT_DATA_SUCCESS";
export const GET_PRODUCT_DATA_FAILURE = "GET_PRODUCT_DATA_FAILURE";

export const GET_PRODUCT_DETAIL_DATA = 'GET_PRODUCT_DETAIL_DATA';
export const GET_PRODUCT_DETAIL_DATA_SUCCESS = "GET_PRODUCT_DETAIL_DATA_SUCCESS";
export const GET_PRODUCT_DETAIL_DATA_FAILURE = "GET_PRODUCT_DATA_FAILURE";
// watcher saga: watches for actions dispatched to the store, starts worker saga
export default [
  watcherProduct(),
  watcherProductDetail()
];

function* watcherProduct() {
  yield takeLatest(GET_PRODUCT_DATA, workerSaga);
}
function* watcherProductDetail() {
  yield takeLatest(GET_PRODUCT_DETAIL_DATA, workerProduct);
}

function* workerProduct(id) {
  try {
    const response = yield call(ProductModel.getDetail, id.id);
    
    const product = response.data;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_PRODUCT_DETAIL_DATA_SUCCESS, items: product });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_PRODUCT_DETAIL_DATA_FAILURE, error });
  }
  
}

// worker saga: makes the api call when watcher saga sees the action
function* workerSaga() {
  try {
    const response = yield call(ProductModel.getList);
    
    const product = response.data;

    // dispatch a success action to the store with the new product
    yield put({ type: GET_PRODUCT_DATA_SUCCESS, items: product });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: GET_PRODUCT_DATA_FAILURE, error });
  }
}