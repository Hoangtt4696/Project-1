// // action types
// import {
//   GET_VOTING_DATA_FAILURE,
//   GET_VOTING_DATA_SUCCESS,
//   POST_VOTING_SUCCESS,
//   POST_VOTING_FAILURE,
//   SET_VOTING_STATUS_FAILURE
// } from '../../actions/admin/create-voted';

// export default {
//   createVoting
// }

// // reducer with initial state
// const initialState = {
//   fetching: true,
//   votingData: [],
//   error: null
// };

// function createVoting(state = initialState, action) {
//   switch (action.type) {
//     case GET_VOTING_DATA_SUCCESS:
//       return { ...state, fetching: false, votingData: action.votingData };
//     case GET_VOTING_DATA_FAILURE:
//       return { ...state, fetching: false, votingData: [], error: action.error };
//     case POST_VOTING_SUCCESS:
//       return { ...state, fetching: false, votingData: action.votingData};
//     case POST_VOTING_FAILURE:
//       return { ...state, fetching: false, error: action.error};
//     case SET_VOTING_STATUS_FAILURE:
//       return { ...state, fetching: false, error: action.error};
//     default:
//       return state;
//   }
// }