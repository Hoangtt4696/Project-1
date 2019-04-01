import {
  GET_VOTING_LIMIT_DETAIL,
  GET_VOTING_LIMIT_DETAIL_FAILURE,
  GET_VOTING_LIMIT_DETAIL_SUCCESS,
  POST_VOTING_LIMIT,
  POST_VOTING_LIMIT_SUCCESS,
  POST_VOTING_LIMIT_FAILURE,
} from '../../actions/admin/voting-limit';

export default { votingLimit }
// reducer with initial state
const initialState = {
  isFetching: false,
  votingLimit: {},
  error: {}
};

function votingLimit(state = initialState, action) {
  switch (action.type) {
    case GET_VOTING_LIMIT_DETAIL:
      return { ...state, isFetching: true, error: {} };
    case GET_VOTING_LIMIT_DETAIL_SUCCESS:
      return { ...state, isFetching: false, votingLimit: action.votingLimit, error: {} };
    case GET_VOTING_LIMIT_DETAIL_FAILURE:
      return { ...state, isFetching: false, votingLimit: {}, error: action.error };

    case POST_VOTING_LIMIT:
      return { ...state, isFetching: true, error: {} };
    case POST_VOTING_LIMIT_SUCCESS:
      return { ...state, isFetching: false, votingLimit: action.votingLimit, error: {} };
    case POST_VOTING_LIMIT_FAILURE:
      return { ...state, isFetching: false, error: action.error };
    default:
      return state;
  }
}