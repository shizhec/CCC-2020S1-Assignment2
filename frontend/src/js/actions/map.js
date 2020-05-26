import {
  UPDATE_MAP_FULL_SCREEN_STATUS,
  UPDATE_MAP_CENTER_AND_ZOOM,
  UPDATE_LAST_CLICKED_INFO,
} from "../actionTypes/map";
import { UPDATE_DESIGNATED_COMPARING_TARGET_ADDRESS } from "../actionTypes/comparison";

import {
  updateCurrentComparisonTargetIndex,
  updateComparisonPanelVisibility,
} from "./comparison";

import {builtReverseGeocodingUrl, getCityAddressObject} from "../utils/googleMap";

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

export function updateLastClickedInfo(lastClickedInfo = null) {
  return {
    type: UPDATE_LAST_CLICKED_INFO,
    payload: { lastClickedInfo },
  };
}

export const reverseGeocoding = (
  { lat, lng, x, y },
  currentComparingTargetIndex = null
) => (dispatch) =>
  fetch(builtReverseGeocodingUrl(lat, lng))
    .then((res) => {
      if (res.ok) {
        return res.json();
      }

      throw res.statusText;
    })
    .then((address) => {
      console.log("address =", address);
      console.log("cityName =", getCityAddressObject(address));
      console.log("currentComparingTargetIndex =", currentComparingTargetIndex);

      if (currentComparingTargetIndex === null) {
        dispatch(updateLastClickedInfo({ lat, lng, x, y, address }));
      } else {
        // If the current comparison target index is not null, the location user clicked is for comparison.
        dispatch({
          type: UPDATE_DESIGNATED_COMPARING_TARGET_ADDRESS,
          payload: { currentComparingTargetIndex, address },
        });
        // Reset the current comparison target index.
        dispatch(updateCurrentComparisonTargetIndex());
        // Show the comparison panel.
        dispatch(updateComparisonPanelVisibility(true));
      }
    });
