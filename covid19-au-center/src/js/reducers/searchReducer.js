import { UPDATE_SEARCH_FIELD_EXPANSION_STATUS } from "../actionTypes/search";

const SEARCH_REDUCER_DEFAULT_VALUE = {
  showSearchInput: false,
};

export function searchReducer(state = SEARCH_REDUCER_DEFAULT_VALUE, action) {
  switch (action.type) {
    case UPDATE_SEARCH_FIELD_EXPANSION_STATUS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
