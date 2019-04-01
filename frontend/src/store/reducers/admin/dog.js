// action types
import { GET_DOG_DATA, GET_DOG_DATA_SUCCESS, GET_DOG_DATA_FAILURE } from "../../actions/admin/dog";


// reducer with initial state
const initialState = {
  fetching: false,
  dog: null,
  error: null
};

export function dog(state = initialState, action) {
  switch (action.type) {
    case GET_DOG_DATA:
      return { ...state, fetching: true, error: null };
    case GET_DOG_DATA_SUCCESS:
      return { ...state, fetching: false, dog: action.dog };
    case GET_DOG_DATA_FAILURE:
      return { ...state, fetching: false, dog: null, error: action.error };
    default:
      return state;
  }
}