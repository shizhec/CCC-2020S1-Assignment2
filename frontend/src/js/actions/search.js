import { UPDATE_SEARCH_FIELD_EXPANSION_STATUS } from "../actionTypes/search";

export function updateSearchFieldExpansionStatus(showSearchInput = true) {
  return {
    type: UPDATE_SEARCH_FIELD_EXPANSION_STATUS,
    payload: { showSearchInput },
  };
}
