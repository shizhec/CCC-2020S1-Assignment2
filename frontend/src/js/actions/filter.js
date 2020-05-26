import {
  UPDATE_DATE_RANGE,
  UPDATE_SELECTED_DATA_SOURCE,
} from "../actionTypes/filter";

export function updateDateRange(datesRange = []) {
  return {
    type: UPDATE_DATE_RANGE,
    payload: { datesRange },
  };
}

export function updateSelectedDataSource(dataSource) {
  return {
    type: UPDATE_SELECTED_DATA_SOURCE,
    payload: { dataSource },
  };
}
