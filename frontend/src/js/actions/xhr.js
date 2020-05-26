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
} from "../constants/api";
import {
  OVERVIEW_DATA_RECEIVED,
  VIC_LGA_OVERVIEW_RECEIVED,
  RECEIVE_AURIN_DATA,
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
        console.log("overviewData =", overviewData);
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
        console.log("vicLGAOverviewData =", vicLGAOverviewData);
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

function getDataByLGA(API, lgaName, callback, startDate = "", endDate = "") {
  return (dispatch) => {
    return fetch(
      `${API}?region=${lgaName}${startDate ? `&date_start=${startDate}` : ""}${
        endDate ? `&date_end=${endDate}` : ""
      }`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw res.statusText;
      })
      .then((value) => callback(dispatch, ...value));
  };
}

export function getTweetCountOfLGA(lgaName, startDate = "", endDate = "") {
  return getDataByLGA(
    API__GET_TWEET_COUNT_OF_LGA,
    lgaName,
    (dispatch, lgaTweetCount) => {
      console.log("In getTweetCountOfLGA, lgaTweetCount =", lgaTweetCount);
      console.log("In getTweetCountOfLGA, dispatch =", dispatch);
    },
    startDate,
    endDate
  );
}

export function getCoronaInfoOfLGA(lgaName, startDate = "", endDate = "") {
  return getDataByLGA(
    API__GET_CORONA_INFO_OF_LGA,
    lgaName,
    (dispatch, coronaInfo) => {
      console.log("In getCoronaInfoOfLGA, coronaInfo =", coronaInfo);
      console.log("In getCoronaInfoOfLGA, dispatch =", dispatch);
    },
    startDate,
    endDate
  );
}

export function getSentimentOfLGA(lgaName, startDate = "", endDate = "") {
  return getDataByLGA(
    API__GET_SENTIMENT_OF_LGA,
    lgaName,
    (dispatch, sentiment) => {
      console.log("In getSentimentOfLGA, sentiment =", sentiment);
      console.log("In getSentimentOfLGA, dispatch =", dispatch);
    },
    startDate,
    endDate
  );
}

export function getHashtagOfLGA(lgaName, startDate = "", endDate = "") {
  return getDataByLGA(
    API__GET_HASHTAG_OF_LGA,
    lgaName,
    (dispatch, hashtag) => {
      console.log("In getHashtagOfLGA, hashtag =", hashtag);
      console.log("In getHashtagOfLGA, dispatch =", dispatch);
    },
    startDate,
    endDate
  );
}

export function getHashtagOverviewOfLGA(lgaName, startDate = "", endDate = "") {
  return getDataByLGA(
    API__GET_HASHTAG_OVERVIEW_OF_LGA,
    lgaName,
    (dispatch, hashtagOverview) => {
      console.log(
        "In getHashtagOverviewOfLGA, hashtagOverview =",
        hashtagOverview
      );
      console.log("In getHashtagOverviewOfLGA, dispatch =", dispatch);
    },
    startDate,
    endDate
  );
}

// todo: /api/sentiment_user

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
      // getTweetCountOfLGA(lgaName, startDate, endDate)(dispatch),
      // getCoronaInfoOfLGA(lgaName, startDate, endDate)(dispatch),
      // getSentimentOfLGA(lgaName, startDate, endDate)(dispatch),
      // getHashtagOfLGA(lgaName, startDate, endDate)(dispatch),
      // getHashtagOverviewOfLGA(lgaName, startDate, endDate)(dispatch),
      getAurinData(lgaName)(dispatch),
    ]).finally(() => dispatch(stopLoading()));
  };
}
