/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import { UPDATE_LOADING_STATUS } from "../actionTypes/loading";

function updateLoadingStatus(isLoading = false) {
  return {
    type: UPDATE_LOADING_STATUS,
    payload: { isLoading },
  };
}

export const startLoading = () => updateLoadingStatus(true);
export const stopLoading = () => updateLoadingStatus();
