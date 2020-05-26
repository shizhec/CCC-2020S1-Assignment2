import React from "react";
import { connect } from "react-redux";
import { Button } from "antd";

import {
  updateCurrentComparisonTargetIndex,
  updateComparisonPanelVisibility,
} from "../../actions/comparison";
import {
  getFormattedAddress,
  getCityName,
  getStateName,
} from "../../utils/googleMap";

function ComparisonButtonComponent({
  currentComparisonTarget,
  startSelectingTarget,
  isSelecting,
}) {
  let formattedAddress = "";
  let cityName = "";
  let stateName = "";
  if (currentComparisonTarget) {
    formattedAddress = getFormattedAddress(currentComparisonTarget);
    cityName = getCityName(currentComparisonTarget);
    stateName = getStateName(currentComparisonTarget);
  }

  return (
    <Button
      type="dashed"
      onClick={startSelectingTarget}
      className={isSelecting ? "selecting" : ""}
    >
      {cityName && (
        <span>
          <b>City: </b> {cityName}
        </span>
      )}
      {stateName && (
        <span>
          <b>State: </b> {stateName}
        </span>
      )}
      {!cityName && !stateName && (
        <span>
          {isSelecting
            ? "Selecting the comparison target"
            : "Click to select the comparison target"}
        </span>
      )}
    </Button>
  );
}

const mapStateToProps = (state, { isFirstTarget = false }) => {
  const { comparisonTargets, currentComparingTargetIndex } = state.comparison;

  const currentButtonIndex = isFirstTarget ? 0 : 1;
  const currentComparisonTarget = comparisonTargets[currentButtonIndex];

  const isSelecting = currentComparingTargetIndex === currentButtonIndex;

  return { currentComparisonTarget, isSelecting };
};

const mapDispatchToProps = (dispatch, { isFirstTarget }) => {
  return {
    startSelectingTarget: () => {
      dispatch(updateCurrentComparisonTargetIndex(isFirstTarget ? 0 : 1));
      dispatch(updateComparisonPanelVisibility());
    },
  };
};

const ComparisonButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComparisonButtonComponent);

export { ComparisonButton };
