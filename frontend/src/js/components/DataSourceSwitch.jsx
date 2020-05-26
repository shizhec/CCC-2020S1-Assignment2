import React, { Component } from "react";
import { connect } from "react-redux";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Popover, Radio } from "antd";

import { TitleWithTooltip } from "./gadgets/";
import { updateSelectedDataSource } from "../actions/filter";

const DATA_SOURCES = [
  { label: "Australia COVID-19", value: "overview" },
  { label: "Victoria COVID-19 By LGA", value: "vicLGAOverviewData" },
];

class DataSourceSwitchComponent extends Component {
  render() {
    const { isFullScreen, dataSource } = this.props;

    if (isFullScreen) {
      return (
        <Popover
          content={
            <Radio.Group
              options={DATA_SOURCES}
              onChange={(event) =>
                this.props.updateSelectedDataSource(
                  event.target.value || this.props.dataSource
                )
              }
              value={dataSource}
            />
          }
          placement={"left"}
          title={
            <TitleWithTooltip
              placement={"leftTop"}
              title={"Rendering Data"}
              tooltipInfo={
                "Please select the data you want to render on the map"
              }
            />
          }
          trigger={"click"}
        >
          <UnorderedListOutlined
            className={"clickable data-source-selector map--fullScreen"}
          />
        </Popover>
      );
    }

    return (
      <Radio.Group
        options={DATA_SOURCES}
        onChange={(event) =>
          this.props.updateSelectedDataSource(
            event.target.value || this.props.dataSource
          )
        }
        value={dataSource}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { isFullScreen } = state.map;
  const { dataSource } = state.filter;
  return { isFullScreen, dataSource };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSelectedDataSource: (dataSource) =>
      dispatch(updateSelectedDataSource(dataSource)),
  };
};
const DataSourceSwitch = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataSourceSwitchComponent);

export { DataSourceSwitch };
