// // action types
// import {
//   GET_GENERAL_SETTING_DATA_FAILURE,
//   GET_GENERAL_SETTING_DATA_SUCCESS,
//   PUT_GENERAL_SETTING_DATA_SUCCESS,
//   PUT_GENERAL_SETTING_DATA_FAILURE
// } from '../../actions/admin/setting-general';

// export default {
//   generalSetting,
//   // postGeneralSetting,
//   // putGeneralSetting
// }

// // reducer with initial state
// const initialState = {
//   fetching: true,
//   settings: [],
//   error: null
// };

// function generalSetting(state = initialState, action) {
//   switch (action.type) {
//     case GET_GENERAL_SETTING_DATA_SUCCESS:
//       return { ...state, fetching: false, settings: action.settings };
//     case GET_GENERAL_SETTING_DATA_FAILURE:
//       return { ...state, fetching: false, settings: [], error: action.error };
//     case PUT_GENERAL_SETTING_DATA_SUCCESS:
//       return { ...state, fetching: false, settings: action.settings};
//     case PUT_GENERAL_SETTING_DATA_FAILURE:
//       return { ...state, fetching: false, error: action.error};
//     default:
//       return state;
//   }
// }

// // function postGeneralSetting(state = initialState, action) {
// //   switch (action.type) {
// //     case POST_GENERAL_SETTING_DATA_SUCCESS:
// //       return { ...state, fetching: false, settings: action.settings};
// //     case POST_GENERAL_SETTING_DATA_FAILURE:
// //       return { ...state, fetching: false, error: action.error};
// //     default: 
// //       return state;
// //   }
// // }

// // function putGeneralSetting(state = initialState, action) {
// //   switch (action.type) {
// //     case PUT_GENERAL_SETTING_DATA_SUCCESS:
// //       return { ...state, fetching: false, settings: action.settings};
// //     case PUT_GENERAL_SETTING_DATA_FAILURE:
// //       return { ...state, fetching: false, error: action.error};
// //     default: 
// //       return state;
// //   }
// // }