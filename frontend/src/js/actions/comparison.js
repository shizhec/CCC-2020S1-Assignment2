/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import {
  UPDATE_CURRENT_COMPARING_TARGET_INDEX,
  UPDATE_COMPARISON_PANEL_VISIBILITY,
  UPDATE_COMPARISON_BOARD_VISIBILITY,
} from "../actionTypes/comparison";

export function updateCurrentComparisonTargetIndex(
  currentComparingTargetIndex = null
) {
  return {
    type: UPDATE_CURRENT_COMPARING_TARGET_INDEX,
    payload: { currentComparingTargetIndex },
  };
}

export function updateComparisonPanelVisibility(panelVisible = false) {
  return {
    type: UPDATE_COMPARISON_PANEL_VISIBILITY,
    payload: { panelVisible },
  };
}

export function updateComparisonBoardVisibility(boardVisible = false) {
  return {
    type: UPDATE_COMPARISON_BOARD_VISIBILITY,
    payload: { boardVisible },
  };
}
