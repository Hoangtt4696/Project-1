// action types
import {
  GET_PRODUCT_DATA,
  GET_PRODUCT_DATA_SUCCESS,
  GET_PRODUCT_DATA_FAILURE,
} from '../../actions/admin/product';

import {
  GET_PRODUCT_DETAIL_DATA,
  GET_PRODUCT_DETAIL_DATA_SUCCESS,
  GET_PRODUCT_DETAIL_DATA_FAILURE,
} from '../../actions/admin/product';

export default {
  products,
  product
}
// reducer with initial state
const initialState = {
  fetching: false,
  items: [],
  error: null
};

// reducer with initial state
const initialStateDetail = {
  fetching: false,
  items: {},
  error: null
};

function products(state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCT_DATA:
      return initialState;
    case GET_PRODUCT_DATA_SUCCESS:
      return { ...state, fetching: false, items: action.items };
    case GET_PRODUCT_DATA_FAILURE:
      return { ...state, fetching: false, items: [], error: action.error };
    default:
      return state;
  }
}

function product(state = initialStateDetail, action) {
  switch (action.type) {
    case GET_PRODUCT_DETAIL_DATA:
      return initialState;
    case GET_PRODUCT_DETAIL_DATA_SUCCESS:
      return { ...state, fetching: false, items: action.items };
    case GET_PRODUCT_DETAIL_DATA_FAILURE:
      return { ...state, fetching: false, items: {}, error: action.error };
    default:
      return state;
  }
}