/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import {
  UPDATE_DATE_RANGE,
  UPDATE_SELECTED_DATA_SOURCE,
  UPDATE_DATA_CATEGORY,
  UPDATE_DATA_TYPE,
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

export function updateVisualisationDataCategory(
  visualisationName,
  dataCategory
) {
  return {
    type: UPDATE_DATA_CATEGORY,
    payload: { visualisationName, dataCategory },
  };
}

export function updateVisualisationDataType(visualisationName, dataType) {
  return {
    type: UPDATE_DATA_TYPE,
    payload: { visualisationName, dataType },
  };
}
