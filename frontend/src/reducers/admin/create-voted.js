// action types
import {
  GET_VOTING_DATA,
  GET_VOTING_DATA_FAILURE,
  GET_VOTING_DATA_SUCCESS,
  SET_VOTING_STATUS,
  SET_VOTING_STATUS_SUCCESS,
  SET_VOTING_STATUS_FAILURE,
  PUT_SUBMIT_RESULT,
  PUT_SUBMIT_RESULT_SUCCESS,
  PUT_SUBMIT_RESULT_FAILURE,
  GET_VOTING_DATA_PERIOD_BASED,
  GET_VOTING_DATA_PERIOD_BASED_PAGINATION
} from '../../actions/admin/create-voted';
// import { select } from 'redux-saga/effects';

export default {
  createVoting
}

// reducer with initial state
const initialState = {
  fetching: true,
  votingData: {},
  error: null,
  changedData: null,
  sendResultFetching: false,
  setFetching: false,
  sendResult: null,
  sendResultError: null
};

function createVoting(state = initialState, action) {
  switch (action.type) {
    case GET_VOTING_DATA:
      return { ...state, fetching: true, error: null, changedData: null };
    case GET_VOTING_DATA_PERIOD_BASED: 
      return { ...state, fetching: true, error: null};
    case GET_VOTING_DATA_PERIOD_BASED_PAGINATION:
      return { ...state, fetching: true, error: null};
    case GET_VOTING_DATA_SUCCESS:
      return { ...state, fetching: false, votingData: action.votingData, error: null, };
    case GET_VOTING_DATA_FAILURE:
      return { ...state, fetching: false, votingData: [], error: action.error };
    case SET_VOTING_STATUS:
      return {...state, setFetching: true, error: null, changedData: null};
    case SET_VOTING_STATUS_SUCCESS:
      return { ...state, setFetching: false, error: null, changedData: action.votingData};
    case SET_VOTING_STATUS_FAILURE:
      return { ...state, setFetching: false, error: action.error};
    case PUT_SUBMIT_RESULT:
      return { ...state, sendResultFetching: true, sendResultError: null, sendResult: null};
    case PUT_SUBMIT_RESULT_SUCCESS:
      return { ...state, sendResultFetching: false, sendResultError: null, sendResult: action.id};
    case PUT_SUBMIT_RESULT_FAILURE:
      return { ...state, sendResultFetching: false, sendResult: null, sendResultError: action.error};
    default:
      return state;
  }
}