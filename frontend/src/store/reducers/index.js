import { combineReducers } from 'redux'
import { dog } from './admin/dog'
import product from './admin/product'
const rootReducer = combineReducers({
  dog,
  ...product,
});

export default rootReducer
