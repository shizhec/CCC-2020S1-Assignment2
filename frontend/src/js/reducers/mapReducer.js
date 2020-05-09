import {
  UPDATE_MAP_FULL_SCREEN_STATUS,
  UPDATE_MAP_CENTER_AND_ZOOM,
} from "../actionTypes/map";
import { FULL_SCREEN_MAP } from "../constants/map";

const MAP_REDUCER_DEFAULT_VALUE = {
  isFullScreen: true,
  center: FULL_SCREEN_MAP.INITIAL_CENTER,
  zoom: FULL_SCREEN_MAP.ZOOM_BOUNDARY.min,
};

export function mapReducer(state = MAP_REDUCER_DEFAULT_VALUE, action) {
  switch (action.type) {
    case UPDATE_MAP_FULL_SCREEN_STATUS:
    case UPDATE_MAP_CENTER_AND_ZOOM:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
