import { startLoading, stopLoading } from "./loading";
import { API__GET_OVERALL_INFO } from "../constants/api";
import { OVERVIEW_DATA_RECEIVED } from "../actionTypes/xhr";

export function getOverviewData() {
  return (dispatch) => {
    dispatch(startLoading());

    return fetch(API__GET_OVERALL_INFO)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw res.statusText;
      })
      .then((overviewData) => {
        dispatch(stopLoading());
        dispatch({ type: OVERVIEW_DATA_RECEIVED, payload: { overviewData } });
      });
  };
}
