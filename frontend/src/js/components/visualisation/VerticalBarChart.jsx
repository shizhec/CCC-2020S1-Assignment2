import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer
} from "recharts";

import { extractDataByTypeFromOverview } from "../../utils/overviewDataExtraction";
import { COLOR_MAPPING } from "../../constants/covid19ColorMapping";

class VerticalBarChartComponent extends Component {
  render() {
    const { data } = this.props;

    console.log("data =", data);

    return (
      <ResponsiveContainer>
        <BarChart width={600} height={250} data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={80} />
          <Tooltip />
          <Bar
            dataKey={"value"}
            barSize={40}
            animationDuration={4000}
            name={"Number"}
          >
            {data.map((barData, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLOR_MAPPING.get(barData.name)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const data = extractDataByTypeFromOverview(state.xhr.overviewData);
  return { data };
};

const VerticalBarChart = connect(mapStateToProps)(VerticalBarChartComponent);

export { VerticalBarChart };
