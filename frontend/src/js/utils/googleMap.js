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
export function getCityName(address, getLongName = true) {
  const cityAddressObject = getCityAddressObject(address);
  if (cityAddressObject) {
    const components = cityAddressObject.address_components[0];

    return getLongName ? components.long_name : components.short_name;
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
export function getStateName(address, getLongName = true) {
  const stateAddressObject = getStateAddressObject(address);
  if (stateAddressObject) {
    const components = stateAddressObject.address_components[0];
    return getLongName ? components.long_name : components.short_name;
  }

  return "";
}

/**
 * Get the admin area level 1 (state)'s short name (e.g. VIC for Victoria).
 *
 * @export
 * @param {*} address Google returned JSON.
 * @returns State's short name if found, otherwise empty string.
 */
export function getStateShortName(address) {
  return getStateName(address, false);
}

/**
 * Convert the RGB color to the Hex color.
 *
 * @param {*} r Red value of the color.
 * @param {*} g Green value of the color.
 * @param {*} b Blue value of the color.
 * @returns Provided color in the Hex format.
 */
function rgbToHex(r, g, b) {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
}

/**
 * Convert the Hex color to RGB color.
 *
 * @param {*} hex Color in Hex format.
 * @returns Provided color in RGB format.
 */
function hexToRgb(hex) {
  const rgb = [];
  for (let i = 1; i < 7; i += 2) {
    rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
  }
  return rgb;
}

/**
 * Given the starting color, ending color, and number of
 * color we want, do some calculations and return an array
 * with the number of color we need, in Hex format.
 *
 * @export
 * @param {*} startColor
 * @param {*} endColor
 * @param {*} step
 * @returns
 */
export function gradient(startColor, endColor, step) {
  const sColor = hexToRgb(startColor),
    eColor = hexToRgb(endColor);
  const rStep = (eColor[0] - sColor[0]) / step,
    gStep = (eColor[1] - sColor[1]) / step,
    bStep = (eColor[2] - sColor[2]) / step;
  const gradientColorArr = [];
  for (let i = 0; i < step; i++) {
    gradientColorArr.push(
      rgbToHex(
        parseInt(rStep * i + sColor[0]),
        parseInt(gStep * i + sColor[1]),
        parseInt(bStep * i + sColor[2])
      )
    );
  }
  return gradientColorArr;
}
