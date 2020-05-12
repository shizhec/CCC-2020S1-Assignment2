import {
  UPDATE_DATE_PICKER_EXPANSION_STATUS,
  UPDATE_DATE_RANGE,
} from "../actionTypes/filter";

export function updateDatePickerExpansionStatus(showDatePicker = true) {
  return {
    type: UPDATE_DATE_PICKER_EXPANSION_STATUS,
    payload: { showDatePicker },
  };
}

export function updateDateRange(datesRange = []) {
  return {
    type: UPDATE_DATE_RANGE,
    payload: { datesRange },
  };
}
