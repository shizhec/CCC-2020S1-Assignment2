import React, { Component } from "react";
import { connect } from "react-redux";
import { DiffOutlined, FileTwoTone } from "@ant-design/icons";
import { Popover, Button } from "antd";

import {
  updateComparisonPanelVisibility,
  updateComparisonBoardVisibility,
} from "../../actions/comparison";
import { TitleWithTooltip } from "../gadgets/";
import { ComparisonButton } from "./ComparisonButton";

class ComparisonPanelComponent extends Component {
  render() {
    const {
      isFullScreen,
      updateComparisonPanelVisibility,
      panelVisible,
      comparisonTargets,
      startComparison,
    } = this.props;

    const comparisonPanel = (
      <>
        <section className={"comparison-buttons-container"}>
          <ComparisonButton isFirstTarget />
          <ComparisonButton />
        </section>

        <Button
          type={"primary"}
          id={"comparison-btn"}
          disabled={
            !(comparisonTargets && comparisonTargets[0] && comparisonTargets[1])
          }
          onClick={startComparison}
        >
          Start Comparison
        </Button>
      </>
    );

    if (isFullScreen) {
      return (
        <Popover
          placement={"left"}
          visible={panelVisible}
          id={"comparison-panel-container"}
          title={
            <TitleWithTooltip
              title={"Comparison Panel"}
              tooltipInfo={
                "Please select the data you want to render on the map"
              }
            />
          }
          trigger={"click"}
          content={comparisonPanel}
        >
          <DiffOutlined
            className={"clickable comparison-panel map--fullScreen"}
            onClick={() => updateComparisonPanelVisibility(!panelVisible)}
          />
        </Popover>
      );
    }

    return comparisonPanel;
  }
}

const mapStateToProps = (state) => {
  const { isFullScreen } = state.map;
  const { panelVisible, comparisonTargets } = state.comparison;

  return { isFullScreen, panelVisible, comparisonTargets };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateComparisonPanelVisibility: (panelVisible) =>
      dispatch(updateComparisonPanelVisibility(panelVisible)),
    startComparison: () => {
      dispatch(updateComparisonPanelVisibility(false));
      dispatch(updateComparisonBoardVisibility(true));
    },
  };
};

const ComparisonPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComparisonPanelComponent);

export { ComparisonPanel };
