/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import {
  UPDATE_SEARCH_FIELD_EXPANSION_STATUS,
  UPDATE_TWEET_USER_MODAL_STATUS,
} from "../actionTypes/search";

export function updateSearchFieldExpansionStatus(showSearchInput = true) {
  return {
    type: UPDATE_SEARCH_FIELD_EXPANSION_STATUS,
    payload: { showSearchInput },
  };
}

export function updateTweetUserModalStatus(tweetUserBoardIsOpen = false) {
  return {
    type: UPDATE_TWEET_USER_MODAL_STATUS,
    payload: { tweetUserBoardIsOpen },
  };
}