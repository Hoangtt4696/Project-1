// action types
import {
  GET_VOTE_POINT_DATA,
  GET_VOTE_POINT_DATA_SUCCESS,
  GET_VOTE_POINT_DATA_FAILURE,
  POST_ASSESS_DATA_SUCCESS,
  POST_ASSESS_DATA_FAILURE,
  POST_ASSESS_DATA,
  GET_ALL_VOTE_POINT_DATA,
  GET_ALL_VOTE_POINT_DATA_FAILURE,
  GET_ALL_VOTE_POINT_DATA_SUCCESS
} from '../../actions/admin/assess';

export default {
  assess
}

// reducer with initial state
const initialState = {
  fetching: true,
  listVotePoint: [],
  votePointData: {},
  error: null,
  postFetching: false
};

function assess(state = initialState, action) {
  switch (action.type) {
    case GET_VOTE_POINT_DATA:
      return { ...state, fetching: true }
    case GET_VOTE_POINT_DATA_SUCCESS:
      return { ...state, fetching: false, votePointData: action.listVotePoint.length > 0 ? action.listVotePoint[0] : {} };
    case GET_VOTE_POINT_DATA_FAILURE:
      return { ...state, fetching: false,votePointData: {}, error: action.error };
    case GET_ALL_VOTE_POINT_DATA:
      return { ...state, fetching: true }
    case GET_ALL_VOTE_POINT_DATA_SUCCESS:
      return { ...state, fetching: false, listVotePoint: action.listVotePoint};
    case GET_ALL_VOTE_POINT_DATA_FAILURE:
      return { ...state, fetching: false, listVotePoint: [], error: action.error };
    case POST_ASSESS_DATA:
      return { ...state, postFetching: true };
    case POST_ASSESS_DATA_SUCCESS:
      return { ...state, postFetching: false, votePointData: action.listVotePoint._id ? action.listVotePoint : {} };
    case POST_ASSESS_DATA_FAILURE:
      return { ...state, postFetching: false, error: action.error};
    default:
      return state;
  }
}
