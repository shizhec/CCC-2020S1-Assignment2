import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Card, Col } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";

import {
  updateDatePickerExpansionStatus,
  updateDateRange,
} from "../actions/filter";
import { CollapseButton, TitleWithTooltip } from "./gadgets";

import "../../css/filter.css";

class FilterComponent extends Component {
  render() {
    const {
      isFullScreen,
      showDatePicker,
      expandDatePicker,
      hideDatePicker,
      datesRange,
      updateDateRange,
    } = this.props;

    const dateRangePicker = (
      <DatePicker.RangePicker
        defaultValue={datesRange}
        onChange={(date) => updateDateRange(date)}
        disabledDate={(current) => current && current > moment().endOf("day")}
      />
    );

    if (isFullScreen) {
      if (showDatePicker) {
        return (
          <section className={"collapsible-section filter map--fullScreen"}>
            <CollapseButton onClickHandler={hideDatePicker} />
            {dateRangePicker}
          </section>
        );
      }
      return (
        <CalendarOutlined
          className={"clickable filter map--fullScreen"}
          onClick={expandDatePicker}
        />
      );
    }

    return (
      <Col span={12}>
        <Card hoverable id={"filter-card"} className="col-6" title={"Filters"}>
          <Card
            hoverable
            type="inner"
            title={
              <TitleWithTooltip
                title={"Date Range"}
                tooltipInfo={"Please select the date range you want to explore"}
              />
            }
          >
            {dateRangePicker}
          </Card>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = (state) => {
  const { isFullScreen } = state.map;
  const { showDatePicker, datesRange } = state.filter;
  return { isFullScreen, showDatePicker, datesRange };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    expandDatePicker: () => dispatch(updateDatePickerExpansionStatus()),
    hideDatePicker: () => dispatch(updateDatePickerExpansionStatus(false)),
    updateDateRange: (selectedDateRange) =>
      dispatch(updateDateRange(selectedDateRange)),
  };
};
const Filter = connect(mapStateToProps, mapDispatchToProps)(FilterComponent);

export { Filter };
