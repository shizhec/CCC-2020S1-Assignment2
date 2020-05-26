import React from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart as RechartLine,
} from "recharts";

import { CovidLegend } from "./CovidLegend";
import { Covid19DataTypeSwitch } from "../gadgets/Covid19DataTypeSwitch";

import { extractAllDataByDateFromOverview } from "../../utils/overviewDataExtraction";
import { COLOR_MAPPING } from "../../constants/covid19ColorMapping";
import { STATE_MAPPING } from "../../constants/states";
import { getStateShortName } from "../../utils/googleMap";

const VISUALISATION_NAME = "trends";

function LineChartComponent({ data, targetState, visualisationName }) {
  return (
    <Card
      hoverable
      className="col-6 trend-card"
      title={`Covid-19 Trends In ${
        targetState ? STATE_MAPPING.get(targetState) : "Australia"
      }`}
    >
      <div style={{ height: "90%" }}>
        <Covid19DataTypeSwitch visualisationName={visualisationName} />

        <ResponsiveContainer>
          <RechartLine
            data={data}
            width={730}
            height={220}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis type="number" />
            <Tooltip />

            {Array.from(COLOR_MAPPING.entries()).map(([type, color], index) => (
              <Line
                key={`line-${index}`}
                type="monotone"
                dataKey={type}
                stroke={color}
                animationDuration={4000}
              />
            ))}
          </RechartLine>
        </ResponsiveContainer>
      </div>
      <CovidLegend />
      {data.length === 0 && (
        <div className={"empty-data-cover"}>
          <h2>
            Oops, there are no data available under current filtering
            criteria...
          </h2>
        </div>
      )}
    </Card>
  );
}

const mapStateToProps = (
  state,
  { targetState, visualisationName = VISUALISATION_NAME }
) => {
  const { datesRange } = state.filter;
  const { lastClickedInfo } = state.map;

  if (!targetState && lastClickedInfo && lastClickedInfo.address) {
    targetState = getStateShortName(lastClickedInfo.address);
  }

  return {
    data: extractAllDataByDateFromOverview(
      state.xhr.overviewData,
      targetState,
      datesRange,
      state.filter.dataTypesByVisualisationNames[visualisationName]
    ),
    targetState,
    visualisationName,
  };
};

const LineChart = connect(
  mapStateToProps,
  null,
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
  })
)(LineChartComponent);

export { LineChart };
