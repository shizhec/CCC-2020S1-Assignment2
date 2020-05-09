import {
  UPDATE_MAP_FULL_SCREEN_STATUS,
  UPDATE_MAP_CENTER_AND_ZOOM,
} from "../actionTypes/map";

export function updateMapFullScreenStatus(isFullScreen = true) {
  return {
    type: UPDATE_MAP_FULL_SCREEN_STATUS,
    payload: { isFullScreen },
  };
}

export function updateMapCenterAndZoom(center, zoom) {
  return {
    type: UPDATE_MAP_CENTER_AND_ZOOM,
    payload: { center, zoom },
  };
}
