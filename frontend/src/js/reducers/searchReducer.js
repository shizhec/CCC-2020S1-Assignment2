<<<<<<< HEAD
/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import { UPDATE_SEARCH_FIELD_EXPANSION_STATUS } from "../actionTypes/search";
=======
import {
  UPDATE_SEARCH_FIELD_EXPANSION_STATUS,
  UPDATE_TWEET_USER_MODAL_STATUS,
} from "../actionTypes/search";
import {
  UPDATE_SEARCH_BOX_LOADING_STATUS,
  RECEIVE_USER_SENTIMENT,
} from "../actionTypes/xhr";
>>>>>>> c6d70ef69658ffe2a3d749d873c484e41138f86f

const SEARCH_REDUCER_DEFAULT_VALUE = {
  showSearchInput: false,
  options: [],
  isSearching: false,
  userSentiment: null,
  tweetUserBoardIsOpen: false,
};

export function searchReducer(state = SEARCH_REDUCER_DEFAULT_VALUE, action) {
  switch (action.type) {
    case UPDATE_SEARCH_FIELD_EXPANSION_STATUS:
    case UPDATE_SEARCH_BOX_LOADING_STATUS:
    case RECEIVE_USER_SENTIMENT:
    case UPDATE_TWEET_USER_MODAL_STATUS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
