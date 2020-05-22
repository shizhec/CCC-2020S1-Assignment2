import { OVERVIEW_DATA_RECEIVED } from "../actionTypes/xhr";

const XHR_REDUCER = {
  overviewData: {},
};

export function xhrReducer(state = XHR_REDUCER, action) {
  switch (action.type) {
    case OVERVIEW_DATA_RECEIVED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
