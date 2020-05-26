import {
  OVERVIEW_DATA_RECEIVED,
  VIC_LGA_OVERVIEW_RECEIVED,
  RECEIVE_AURIN_DATA,
  RECEIVE_TWEET_COUNT_OF_LGA,
  RECEIVE_CORONA_COUNT_OF_LGA,
  RECEIVE_SENTIMENT_OF_LGA,
  REVIEW_HASHTAG_OF_LGA,
  REVIEW_HASHTAG_OVERVIEW_OF_LGA,
  RESET_LGA_DATA,
} from "../actionTypes/xhr";

const LGA_INIT_DATA = {
  aurin: null,
  tweetCount: null,
  coronaCount: null,
  sentiment: null,
  hashtagCount: null,
  hashtagOverview: [],
};

const XHR_REDUCER = {
  overviewData: {},
  vicLGAOverviewData: {},
  ...LGA_INIT_DATA,
};

export function xhrReducer(state = XHR_REDUCER, action) {
  switch (action.type) {
    case OVERVIEW_DATA_RECEIVED:
    case VIC_LGA_OVERVIEW_RECEIVED:
    case RECEIVE_AURIN_DATA:
    case RECEIVE_TWEET_COUNT_OF_LGA:
    case RECEIVE_CORONA_COUNT_OF_LGA:
    case RECEIVE_SENTIMENT_OF_LGA:
    case REVIEW_HASHTAG_OF_LGA:
    case REVIEW_HASHTAG_OVERVIEW_OF_LGA:
      return { ...state, ...action.payload };
    case RESET_LGA_DATA:
      return { ...state, ...LGA_INIT_DATA };
    default:
      return state;
  }
}
