/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Card, Col } from "antd";
import { CalendarOutlined, RedoOutlined } from "@ant-design/icons";
import { DatePicker, Popover } from "antd";

import { updateDateRange } from "../actions/filter";
import { TitleWithTooltip } from "./gadgets";
import {
  getFormattedAddress,
  getCityName,
  getStateName,
} from "../utils/googleMap";
import { DataSourceSwitch } from "./DataSourceSwitch";
import { ComparisonPanel } from "./comparison/ComparisonPanel";

import "../../css/filter.css";
import { updateLastClickedInfo, resetLGAData } from "../actions/map";

class FilterComponent extends Component {
  render() {
    // console.log("in Filter, this.props =", this.props);
    const {
      isFullScreen,
      expandDatePicker,
      datesRange,
      updateDateRange,
      lastClickedInfo,
      resetLocationFilter,
    } = this.props;

    const dateRangePicker = (
      <DatePicker.RangePicker
        defaultValue={datesRange}
        onChange={(date) => updateDateRange(date)}
        disabledDate={(current) => current && current > moment().endOf("day")}
      />
    );

    const title = (
      <TitleWithTooltip
        placement={"leftTop"}
        title={"Date Range"}
        tooltipInfo={"Please select the date range you want to explore"}
      />
    );

    if (isFullScreen) {
      return (
        <Popover
          placement={"left"}
          title={title}
          trigger={"click"}
          content={dateRangePicker}
        >
          <CalendarOutlined
            className={"clickable filter map--fullScreen"}
            onClick={expandDatePicker}
          />
        </Popover>
      );
    }

    let formattedAddress = "";
    let cityName = "";
    let stateName = "";
    if (lastClickedInfo && lastClickedInfo.address) {
      const addressObject = lastClickedInfo.address;
      formattedAddress = getFormattedAddress(addressObject);
      cityName = getCityName(addressObject);
      stateName = getStateName(addressObject);
    }

    return (
      <Col span={12}>
        <Card hoverable id={"filter-card"} className="col-6" title={"Filters"}>
          {/* <Card
            hoverable
            type="inner"
            title={
              <TitleWithTooltip
                placement={"leftTop"}
                title={"Rendering Data"}
                tooltipInfo={
                  "Please select the data you want to render on the map"
                }
              />
            }
          >
            <DataSourceSwitch />
          </Card> */}

          <Card
            hoverable
            type="inner"
            title={
              <TitleWithTooltip
                title={"Comparison Panel"}
                tooltipInfo={
                  "Please select the data you want to render on the map"
                }
              />
            }
          >
            <ComparisonPanel />
          </Card>

          <Card hoverable type="inner" title={title}>
            {dateRangePicker}
          </Card>
          <Card
            hoverable
            type="inner"
            id={"location-card"}
            title={
              <>
                <TitleWithTooltip
                  title={"Location"}
                  tooltipInfo={
                    lastClickedInfo
                      ? "This is the position you clicked on the map."
                      : "By default we will show data within Australia"
                  }
                />
                <TitleWithTooltip
                  title={
                    <RedoOutlined
                      className={"clickable"}
                      onClick={resetLocationFilter}
                    />
                  }
                  tooltipInfo={
                    "Click here to reset the location filter to Australia"
                  }
                />
              </>
            }
          >
            {lastClickedInfo && formattedAddress ? (
              <>
                {cityName && (
                  <p>
                    <b>City: </b> {cityName}
                  </p>
                )}
                {stateName && (
                  <p>
                    <b>State: </b> {stateName}
                  </p>
                )}
              </>
            ) : (
              <p>Australia</p>
            )}
          </Card>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = (state) => {
  const { isFullScreen, lastClickedInfo } = state.map;
  const { datesRange } = state.filter;
  return { isFullScreen, datesRange, lastClickedInfo };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateDateRange: (selectedDateRange) =>
      dispatch(updateDateRange(selectedDateRange)),
    resetLocationFilter: () => {
      dispatch(updateLastClickedInfo());
      dispatch(resetLGAData());
    },
  };
};
const Filter = connect(mapStateToProps, mapDispatchToProps)(FilterComponent);

export { Filter };
