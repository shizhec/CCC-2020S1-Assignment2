import {
  OVERVIEW_DATA_RECEIVED,
  VIC_LGA_OVERVIEW_RECEIVED,
  RECEIVE_AURIN_DATA,
  RECEIVE_TWEET_COUNT_OF_LGA,
  RECEIVE_CORONA_COUNT_OF_LGA,
  RECEIVE_SENTIMENT_OF_LGA,
} from "../actionTypes/xhr";

const XHR_REDUCER = {
  overviewData: {},
  vicLGAOverviewData: {},
  aurin: null,
  tweetCount: null,
  coronaCount: null,
  sentiment: null,
};

export function xhrReducer(state = XHR_REDUCER, action) {
  switch (action.type) {
    case OVERVIEW_DATA_RECEIVED:
    case VIC_LGA_OVERVIEW_RECEIVED:
    case RECEIVE_AURIN_DATA:
    case RECEIVE_TWEET_COUNT_OF_LGA:
    case RECEIVE_CORONA_COUNT_OF_LGA:
    case RECEIVE_SENTIMENT_OF_LGA:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
