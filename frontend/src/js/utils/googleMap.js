import {
  API__GOOGLE_REVERSE_GEOCODING_FIRST_HALF,
  API__GOOGLE_REVERSE_GEOCODING_SECOND_HALF,
} from "../constants/api";
import { GOOGLE_MAP_API_KEY } from "../constants/credentials";

/**
 * Given the latitude and longitude, create the API string.
 *
 * @export
 * @param {*} lat Latitude
 * @param {*} lng Longitude
 * @returns
 */
export function builtReverseGeocodingUrl(lat, lng) {
  return `${API__GOOGLE_REVERSE_GEOCODING_FIRST_HALF}${lat},${lng}${API__GOOGLE_REVERSE_GEOCODING_SECOND_HALF}${GOOGLE_MAP_API_KEY}`;
}

/**
 * Get the formatted address from the Google returned JSON.
 *
 * @export
 * @param {*} address Google returned JSON.
 * @returns
 */
export function getFormattedAddress(address) {
  try {
    return address.results[0].formatted_address;
  } catch {
    return "";
  }
}

/**
 * Given the address object, find the address address with given type.
 *
 * @param {*} address Google returned JSON.
 * @param {*} targetType Address type to be looked against.
 * @returns Address object with given type, otherwise null.
 */
function getAddressWithType(address, targetType) {
  try {
    return address.results.find((result) =>
      result.types.find((type) => type === targetType)
    );
  } catch {
    return null;
  }
}

/**
 * Get the admin area level 2 (city)'s address object.
 *
 * @export
 * @param {*} address Google returned JSON.
 * @returns Admin Area Level 2 (city) object, otherwise null.
 */
export function getCityAddressObject(address) {
  return getAddressWithType(address, "administrative_area_level_2");
}

/**
 * Get the admin area level 2 (city)'s name
 *
 * @export
 * @param {*} address Google returned JSON.
 * @returns City name if found, otherwise empty string.
 */
export function getCityName(address) {
  const cityAddressObject = getCityAddressObject(address);
  if (cityAddressObject) {
    return cityAddressObject.address_components[0].long_name;
  }

  return "";
}

/**
 * Get the admin area level 1 (state)'s address object.
 *
 * @export
 * @param {*} address Google returned JSON.
 * @returns Admin Area Level 1 (state) object, otherwise null.
 */
export function getStateAddressObject(address) {
  return getAddressWithType(address, "administrative_area_level_1");
}

/**
 * Get the admin area level 1 (state)'s name.
 *
 * @export
 * @param {*} address Google returned JSON.
 * @returns State name if found, otherwise empty string.
 */
export function getStateName(address) {
  const stateAddressObject = getStateAddressObject(address);
  if (stateAddressObject) {
    return stateAddressObject.address_components[0].long_name;
  }

  return "";
}

export function getStateShortName(address) {
  const stateAddressObject = getStateAddressObject(address);
  if (stateAddressObject) {
    return stateAddressObject.address_components[0].short_name;
  }

  return "";
}
