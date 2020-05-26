import { UPDATE_LOADING_STATUS } from "../actionTypes/loading";

function updateLoadingStatus(isLoading = false) {
  return {
    type: UPDATE_LOADING_STATUS,
    payload: { isLoading },
  };
}

export const startLoading = () => updateLoadingStatus(true);
export const stopLoading = () => updateLoadingStatus();
