// action types
import {
  GET_GENERAL_SETTING_DATA,
  GET_GENERAL_SETTING_DATA_FAILURE,
  GET_GENERAL_SETTING_DATA_SUCCESS,
  PUT_GENERAL_SETTING_DATA,
  PUT_GENERAL_SETTING_DATA_SUCCESS,
  PUT_GENERAL_SETTING_DATA_FAILURE
} from '../../actions/admin/setting-general';

export default {
  generalSetting
}

// reducer with initial state
const initialState = {
  fetching: true,
  settings: {},
  error: null,
  status: 0
};

function generalSetting(state = initialState, action) {
  switch (action.type) {
    case GET_GENERAL_SETTING_DATA: 
      return { ...state, fetching: true, status: 0, error: null };
    case GET_GENERAL_SETTING_DATA_SUCCESS:
      return { ...state, fetching: false, settings: action.generalSetting, error: null };
    case GET_GENERAL_SETTING_DATA_FAILURE:
      return { ...state, fetching: false, settings: [], error: action.error };
    case PUT_GENERAL_SETTING_DATA:
      return { ...state, fetching: true, status: 0, error: null };
    case PUT_GENERAL_SETTING_DATA_SUCCESS:
      return { ...state, fetching: false, settings: action.generalSetting.data, error: null, status: action.generalSetting.status};
    case PUT_GENERAL_SETTING_DATA_FAILURE:
      return { ...state, fetching: false, error: action.error};
    default:
      return state;
  }
}
