// action types
import {
  GET_VOTING_DETAILS_SUCCESS,
  GET_VOTING_DETAILS_FAILURE,
  PUT_VOTING_DETAILS,
  PUT_VOTING_DETAILS_SUCCESS,
  PUT_VOTING_DETAILS_FAILURE,
  SET_VOTING_ACTIVE,
  SET_VOTING_ACTIVE_FAILURE,
  SET_VOTING_ACTIVE_SUCCESS,
  GET_EXPORT,
  GET_EXPORT_SUCCESS,
  GET_EXPORT_FAILURE
} from '../../actions/admin/voting-details';

import {
  CHANGE_STATE_JUSTUPDATE_SUCCESS
} from '../../actions/admin/create-voted';

export default {
  votingDetails
}

// reducer with initial state
const initialState = {
  fetching: true,
  putFetching: true,
  setFetching: false,
  exportFetching: false,
  votingData: {},
  error: null,
  justUpdated: false
};

function votingDetails(state = initialState, action) {
  switch (action.type) {
    case CHANGE_STATE_JUSTUPDATE_SUCCESS: 
      return { ...state, justUpdated: false}
    case GET_VOTING_DETAILS_SUCCESS:
      return { ...state, fetching: false, votingData: action.votingDetails, justUpdated: false };
    case GET_VOTING_DETAILS_FAILURE:
      return { ...state, fetching: false, votingData: {}, error: action.error, justUpdated: false };
    case PUT_VOTING_DETAILS:
      return { ...state, putFetching: true, error: null};
    case PUT_VOTING_DETAILS_SUCCESS:
      return { ...state, putFetching: false, votingData: action.votingDetails, justUpdated: true};
    case PUT_VOTING_DETAILS_FAILURE:
      return { ...state, putFetching: false, error: action.error, justUpdated: false};
    case SET_VOTING_ACTIVE:
      return { ...state, setFetching: true, error: null};
    case SET_VOTING_ACTIVE_SUCCESS:
      return { ...state, setFetching: false, votingData: action.votingData, justUpdated: true, error: null};
    case SET_VOTING_ACTIVE_FAILURE:
      return { ...state, setFetching: false, error: action.error, justUpdated: false};
    case GET_EXPORT: 
      return { ...state, exportFetching: true, error: null};
    case GET_EXPORT_SUCCESS: 
      return { ...state, exportFetching: false, error: null};
    case GET_EXPORT_FAILURE:
      return { ...state, exportFetching: false, error: action.error}
    default:
      return state;
  }
}