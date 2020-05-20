import {
  UPDATE_MAP_FULL_SCREEN_STATUS,
  UPDATE_MAP_CENTER_AND_ZOOM,
  UPDATE_LAST_CLICKED_INFO,
} from "../actionTypes/map";
import { builtReverseGeocodingUrl } from "../utils/googleMap";

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

export const reverseGeocoding = ({ lat, lng, x, y }) => (dispatch) =>
  fetch(builtReverseGeocodingUrl(lat, lng))
    .then((res) => {
      if (res.ok) {
        return res.json();
      }

      throw res.statusText;
    })
    .then((address) => {
      console.log("address =", address);
      dispatch({
        type: UPDATE_LAST_CLICKED_INFO,
        payload: { lastClickedInfo: { lat, lng, x, y, address } },
      });
    });
