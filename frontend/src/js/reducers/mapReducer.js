/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import {
  UPDATE_MAP_FULL_SCREEN_STATUS,
  UPDATE_MAP_CENTER_AND_ZOOM,
  UPDATE_LAST_CLICKED_INFO,
} from "../actionTypes/map";
import { FULL_SCREEN_MAP } from "../constants/map";

const MAP_REDUCER_DEFAULT_VALUE = {
  isFullScreen: true,
  center: FULL_SCREEN_MAP.INITIAL_CENTER,
  zoom: FULL_SCREEN_MAP.ZOOM_BOUNDARY.min,
  lastClickedInfo: null,
};

export function mapReducer(state = MAP_REDUCER_DEFAULT_VALUE, action) {
  switch (action.type) {
    case UPDATE_MAP_FULL_SCREEN_STATUS:
    case UPDATE_MAP_CENTER_AND_ZOOM:
    case UPDATE_LAST_CLICKED_INFO:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
