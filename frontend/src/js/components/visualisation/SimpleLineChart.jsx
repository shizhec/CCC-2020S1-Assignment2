import React, { Component } from "react";
import { connect } from "react-redux";
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { extractAllDataByDateFromOverview } from "../../utils/overviewDataExtraction";
import { COLOR_MAPPING } from "../../constants/covid19ColorMapping";

class SimpleLineChartComponent extends Component {
  render() {
    const { data } = this.props;

    return (
      <ResponsiveContainer>
        <LineChart
          data={data}
          width={730}
          height={250}
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
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { data: extractAllDataByDateFromOverview(state.xhr.overviewData) };
};

const SimpleLineChart = connect(mapStateToProps)(SimpleLineChartComponent);

export { SimpleLineChart };
