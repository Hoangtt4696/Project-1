// import {
//   GET_VOTING_LIMIT_DETAIL_FAILURE,
//   GET_VOTING_LIMIT_DETAIL_SUCCESS,
//   POST_VOTING_LIMIT_SUCCESS,
//   POST_VOTING_LIMIT_FAILURE,
// } from '../../actions/admin/voting-limit';

// export default { votingLimit }
// // reducer with initial state
// const initialState = {
//   fetching: false,
//   votingLimit: {},
//   error: null
// };

// function votingLimit(state = initialState, action) {
//   switch (action.type) {
//     case GET_VOTING_LIMIT_DETAIL_SUCCESS:
//       return { ...state, fetching: false, votingLimit: action.votingLimit };
//     case GET_VOTING_LIMIT_DETAIL_FAILURE:
//       return { ...state, fetching: false, votingLimit: {}, error: action.error };

//     case POST_VOTING_LIMIT_SUCCESS:
//       return { ...state, fetching: false, votingLimit: action.votingLimit };
//     case POST_VOTING_LIMIT_FAILURE:
//       return { ...state, fetching: false, votingLimit: {}, error: action.error };
//     default:
//       return state;
//   }
// }