import {
  UPDATE_DATE_PICKER_EXPANSION_STATUS,
  UPDATE_DATE_RANGE,
} from "../actionTypes/filter";

const FILTER_REDUCER_DEFAULT_VALUE = {
  showDatePicker: false,
  datesRange: [],
};

export function filterReducer(state = FILTER_REDUCER_DEFAULT_VALUE, action) {
  switch (action.type) {
    case UPDATE_DATE_PICKER_EXPANSION_STATUS:
    case UPDATE_DATE_RANGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
