/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 *
 * Map max boundary.
 */
const AUSTRALIA_MAP_SW_BOUND = [98.49663749999871, -44.645685161059006];
const AUSTRALIA_MAP_NE_BOUND = [172.10503593749945, -7.570101850059672];
export const AUSTRALIA_MAP_BOUNDS = [
  AUSTRALIA_MAP_SW_BOUND,
  AUSTRALIA_MAP_NE_BOUND,
];

// Map zoom boundary.
export const FULL_SCREEN_MAP = {
  ZOOM_BOUNDARY: { min: 5, max: 12 },
  INITIAL_CENTER: { lng: 135.4107, lat: -27.616 },
};

export const CARD_MAP = {
  ZOOM_BOUNDARY: { min: 4.5, max: 12 },
  INITIAL_CENTER: { lng: 135.4107, lat: -14 },
};
