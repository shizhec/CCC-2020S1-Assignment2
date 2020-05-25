import React, { Component } from "react";
import { connect } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Sector,
} from "recharts";

import { CovidLegend } from "./CovidLegend";
import { extractDataByTypeFromOverview } from "../../utils/overviewDataExtraction";
import { COLOR_MAPPING } from "../../constants/covid19ColorMapping";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={fill}
      >
        {payload.name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={20}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`Count ${payload.value}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={40}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(percent: ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

class SimplePieChartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 1 };
  }

  render() {
    const { innerData, outerData } = this.props;

    return (
      <ResponsiveContainer>
        <PieChart width={400} height={400}>
          {innerData && (
            <Pie
              data={[innerData]}
              dataKey="value"
              startAngle={180}
              endAngle={-180}
              innerRadius={100}
              outerRadius={130}
              fill={COLOR_MAPPING.get(innerData.name)}
            >
              <Label width={50} position="center">
                COVID-19 In Australia
              </Label>
            </Pie>
          )}
          <Pie
            data={outerData}
            dataKey="value"
            startAngle={180}
            endAngle={-180}
            innerRadius={130}
            outerRadius={160}
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            isAnimationActive={false}
            onMouseEnter={(_, index, e) => {
              this.setState({
                activeIndex: index,
              });
            }}
          >
            {outerData.map((entry, index) => (
              <Cell
                key={`slice-${index}`}
                fill={COLOR_MAPPING.get(entry.name)}
              />
            ))}
            <Label width={50} position="center">
              COVID-19 In Australia
            </Label>
          </Pie>
          <CovidLegend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const extractedData = extractDataByTypeFromOverview(state.xhr.overviewData);

  const innerData = extractedData.find((data) => data.name === "Confirmed");
  const outerData = extractedData.filter((data) => data.name !== "Confirmed");

  return { innerData, outerData };
};

const SimplePieChart = connect(mapStateToProps)(SimplePieChartComponent);

export { SimplePieChart };
