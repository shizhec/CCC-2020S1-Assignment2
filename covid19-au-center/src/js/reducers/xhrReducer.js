import {
  OVERVIEW_DATA_RECEIVED,
  VIC_LGA_OVERVIEW_RECEIVED,
  RECEIVE_AURIN_DATA,
} from "../actionTypes/xhr";

const XHR_REDUCER = {
  overviewData: {},
  vicLGAOverviewData: {},
  aurin: null,
};

export function xhrReducer(state = XHR_REDUCER, action) {
  switch (action.type) {
    case OVERVIEW_DATA_RECEIVED:
    case VIC_LGA_OVERVIEW_RECEIVED:
    case RECEIVE_AURIN_DATA:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
