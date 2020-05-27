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

const FILTER_REDUCER_DEFAULT_VALUE = {
  datesRange: [],
  dataSource: "vicLGAOverviewData",
  dataCategoriesByVisualisationNames: {
    dataByStates: "Confirmed",
  },
  dataTypesByVisualisationNames: {
    dataByStates: true,
    trends: true,
  },
};

export function filterReducer(state = FILTER_REDUCER_DEFAULT_VALUE, action) {
  let visualisationName, dataCategory, dataType;
  switch (action.type) {
    case UPDATE_DATE_RANGE:
    case UPDATE_SELECTED_DATA_SOURCE:
      return { ...state, ...action.payload };
    case UPDATE_DATA_CATEGORY:
      ({ visualisationName, dataCategory } = action.payload);

      return {
        ...state,
        dataCategoriesByVisualisationNames: {
          ...state.dataCategoriesByVisualisationNames,
          [visualisationName]: dataCategory,
        },
      };
    case UPDATE_DATA_TYPE:
      ({ visualisationName, dataType } = action.payload);

      return {
        ...state,
        dataTypesByVisualisationNames: {
          ...state.dataTypesByVisualisationNames,
          [visualisationName]: dataType,
        },
      };
    default:
      return state;
  }
}
