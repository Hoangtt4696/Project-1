// action types
import {
  POST_VOTING_DATA,
  POST_VOTING_SUCCESS,
  POST_VOTING_FAILURE,
} from '../../actions/admin/create-vote-modal';

export default {
  createVotingModal
}

// reducer with initial state
const initialState = {
  fetching: false,
  votingData: {},
  error: {},
};

function createVotingModal(state = initialState, action) {
  switch (action.type) {
    case POST_VOTING_DATA:
      return { ...state, fetching: true, error: {} };
    case POST_VOTING_SUCCESS:
      return { ...state, fetching: false, votingData: action.votingData, error: {}};
    case POST_VOTING_FAILURE:
      return { ...state, fetching: false, error: action.error};
    default:
      return state;
  }
}