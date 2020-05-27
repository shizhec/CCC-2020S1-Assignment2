/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import {
  UPDATE_CURRENT_COMPARING_TARGET_INDEX,
  UPDATE_DESIGNATED_COMPARING_TARGET_ADDRESS,
  UPDATE_COMPARISON_PANEL_VISIBILITY,
  UPDATE_COMPARISON_BOARD_VISIBILITY,
} from "../actionTypes/comparison";

const COMPARISON_REDUCER_DEFAULT_VALUE = {
  currentComparingTargetIndex: null, // it can be either null, 0, or 1.
  comparisonTargets: [null, null],
  panelVisible: false,
  boardVisible: false,
};

export function comparisonReducer(
  state = COMPARISON_REDUCER_DEFAULT_VALUE,
  action
) {
  switch (action.type) {
    case UPDATE_CURRENT_COMPARING_TARGET_INDEX:
    case UPDATE_COMPARISON_PANEL_VISIBILITY:
    case UPDATE_COMPARISON_BOARD_VISIBILITY:
      return { ...state, ...action.payload };
    case UPDATE_DESIGNATED_COMPARING_TARGET_ADDRESS:
      const { currentComparingTargetIndex, address } = action.payload;
      const [currentFirstTarget, currentSecondTarget] = state.comparisonTargets;

      if (currentComparingTargetIndex === 0) {
        return { ...state, comparisonTargets: [address, currentSecondTarget] };
      } else {
        return { ...state, comparisonTargets: [currentFirstTarget, address] };
      }
    default:
      return state;
  }
}
