import { ACTION_SELECT_MENU_ITEM } from '../../actions/admin/admin-menu-left';

const initState = '';

const selectedAdminMenuItem = (state = initState, action) => {
  switch (action.type){
    case ACTION_SELECT_MENU_ITEM:
      state = action.item;
      return state;
    default:
      return state;
  }
}

export default {selectedAdminMenuItem};