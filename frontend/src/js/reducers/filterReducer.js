import {
  UPDATE_DATE_RANGE,
  UPDATE_SELECTED_DATA_SOURCE,
} from "../actionTypes/filter";

const FILTER_REDUCER_DEFAULT_VALUE = {
  datesRange: [],
  dataSource: "overview",
};

export function filterReducer(state = FILTER_REDUCER_DEFAULT_VALUE, action) {
  switch (action.type) {
    case UPDATE_DATE_RANGE:
    case UPDATE_SELECTED_DATA_SOURCE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
