/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import { startLoading, stopLoading } from "./loading";
import {
  API__GET_OVERALL_INFO,
  API__GET_VIC_LGA_COVID_19_OVERVIEW,
  API__GET_TWEET_COUNT_OF_LGA,
  API__GET_CORONA_INFO_OF_LGA,
  API__GET_SENTIMENT_OF_LGA,
  API__GET_HASHTAG_OF_LGA,
  API__GET_HASHTAG_OVERVIEW_OF_LGA,
  API__GET_AURIN_DATA,
  API__GET_USER_SENTIMENT,
} from "../constants/api";
import {
  OVERVIEW_DATA_RECEIVED,
  VIC_LGA_OVERVIEW_RECEIVED,
  RECEIVE_AURIN_DATA,
  RECEIVE_TWEET_COUNT_OF_LGA,
  RECEIVE_CORONA_COUNT_OF_LGA,
  RECEIVE_SENTIMENT_OF_LGA,
  REVIEW_HASHTAG_OF_LGA,
  REVIEW_HASHTAG_OVERVIEW_OF_LGA,
  RECEIVE_USER_SENTIMENT,
  UPDATE_SEARCH_BOX_LOADING_STATUS,
} from "../actionTypes/xhr";

export function getOverviewData() {
  return (dispatch) => {
    return fetch(API__GET_OVERALL_INFO)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw res.statusText;
      })
      .then((overviewData) => {
        // console.log("overviewData =", overviewData);
        dispatch({ type: OVERVIEW_DATA_RECEIVED, payload: { overviewData } });
      });
  };
}

export function getVicLGAOverview() {
  return (dispatch) => {
    return fetch(API__GET_VIC_LGA_COVID_19_OVERVIEW)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw res.statusText;
      })
      .then((vicLGAOverviewData) => {
        // console.log("vicLGAOverviewData =", vicLGAOverviewData);
        dispatch({
          type: VIC_LGA_OVERVIEW_RECEIVED,
          payload: { vicLGAOverviewData },
        });
      });
  };
}

export function getRenderingData() {
  return (dispatch) => {
    dispatch(startLoading());

    return Promise.all([
      getOverviewData()(dispatch),
      getVicLGAOverview()(dispatch),
    ]).finally(() => dispatch(stopLoading()));
  };
}

function getDataByLGA(API, lgaName, startDate = "", endDate = "") {
  return fetch(
    `${API}?region=${lgaName}${startDate ? `&date_start=${startDate}` : ""}${
      endDate ? `&date_end=${endDate}` : ""
    }`
  ).then((res) => {
    if (res.ok) {
      return res.json();
    }

    throw res.statusText;
  });
}

export function getTweetCountOfLGA(lgaName, startDate = "", endDate = "") {
  return (dispatch) =>
    getDataByLGA(API__GET_TWEET_COUNT_OF_LGA, lgaName, startDate, endDate).then(
      ({ count }) =>
        dispatch({
          type: RECEIVE_TWEET_COUNT_OF_LGA,
          payload: { tweetCount: count },
        })
    );
}

export function getCoronaInfoOfLGA(lgaName, startDate = "", endDate = "") {
  return (dispatch) =>
    getDataByLGA(API__GET_CORONA_INFO_OF_LGA, lgaName, startDate, endDate).then(
      ({ count }) =>
        dispatch({
          type: RECEIVE_CORONA_COUNT_OF_LGA,
          payload: { coronaCount: count },
        })
    );
}

export function getSentimentOfLGA(lgaName, startDate = "", endDate = "") {
  return (dispatch) =>
    getDataByLGA(API__GET_SENTIMENT_OF_LGA, lgaName, startDate, endDate).then(
      (sentiment) =>
        dispatch({
          type: RECEIVE_SENTIMENT_OF_LGA,
          payload: { sentiment },
        })
    );
}

export function getHashtagOfLGA(lgaName, startDate = "", endDate = "") {
  return (dispatch) =>
    getDataByLGA(API__GET_HASHTAG_OF_LGA, lgaName, startDate, endDate).then(
      ({ count }) =>
        dispatch({
          type: REVIEW_HASHTAG_OF_LGA,
          payload: { hashtagCount: count },
        })
    );
}

export function getHashtagOverviewOfLGA(lgaName, startDate = "", endDate = "") {
  return (dispatch) =>
    getDataByLGA(
      API__GET_HASHTAG_OVERVIEW_OF_LGA,
      lgaName,
      startDate,
      endDate
    ).then((hashtagOverview) =>
      dispatch({
        type: REVIEW_HASHTAG_OVERVIEW_OF_LGA,
        payload: { hashtagOverview },
      })
    );
}

function updateSearchBoxLoadingStatus(isSearching = false) {
  return {
    type: UPDATE_SEARCH_BOX_LOADING_STATUS,
    payload: { isSearching },
  };
}

export function getUserSentiment(userName, startDate = "", endDate = "") {
  return (dispatch) => {
    dispatch(updateSearchBoxLoadingStatus(true));
    return fetch(
      `${API__GET_USER_SENTIMENT}?user=${userName}${
        startDate ? `&date_start=${startDate}` : ""
      }${endDate ? `&date_end=${endDate}` : ""}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw res.statusText;
      })
      .then((userSentiment) => {
        dispatch(updateSearchBoxLoadingStatus());
        dispatch({
          type: RECEIVE_USER_SENTIMENT,
          payload: { userSentiment, options: [{ value: userName }] },
        });
      });
  };
}

export function getAurinData(lgaName) {
  return (dispatch) => {
    return fetch(`${API__GET_AURIN_DATA}?region=${lgaName}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw res.statusText;
      })
      .then((aurin) =>
        dispatch({ type: RECEIVE_AURIN_DATA, payload: { aurin } })
      );
  };
}

export function getDataOfLGA(lgaName, startDate = "", endDate = "") {
  return (dispatch) => {
    dispatch(startLoading());

    return Promise.all([
      getTweetCountOfLGA(lgaName, startDate, endDate)(dispatch),
      getCoronaInfoOfLGA(lgaName, startDate, endDate)(dispatch),
      getSentimentOfLGA(lgaName, startDate, endDate)(dispatch),
      getHashtagOfLGA(lgaName, startDate, endDate)(dispatch),
      getHashtagOverviewOfLGA(lgaName, startDate, endDate)(dispatch),
      getAurinData(lgaName)(dispatch),
    ]).finally(() => dispatch(stopLoading()));
  };
}
