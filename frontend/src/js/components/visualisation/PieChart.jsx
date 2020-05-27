/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import {
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Sector,
  PieChart as RechartPie,
} from "recharts";

import { extractDataByTypeFromOverview } from "../../utils/overviewDataExtraction";
import { COLOR_MAPPING } from "../../constants/covid19ColorMapping";
import { STATE_MAPPING } from "../../constants/states";
import { getStateShortName } from "../../utils/googleMap";

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
        {payload.name} ({`Count: ${payload.value}`})
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={20}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`(Percent: ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

class PieChartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 1 };
  }

  render() {
    const { innerData, outerData, targetState, timeOfData } = this.props;

    // console.log("In PieChart, this.props =", this.props);

    return (
      <Card
        hoverable
        className="col-6"
        title={`Covid-19 Data Composition In ${
          targetState ? STATE_MAPPING.get(targetState) : "Australia"
        }${timeOfData ? ` (${timeOfData})` : ""}`}
      >
        <ResponsiveContainer>
          <RechartPie width={400} height={400}>
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
                  {`${innerData.value} Confirmed`}
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
            </Pie>
          </RechartPie>
        </ResponsiveContainer>
        {!innerData && outerData.length === 0 && (
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
}

const mapStateToProps = (state, { targetState }) => {
  const { lastClickedInfo } = state.map;

  if (!targetState && lastClickedInfo && lastClickedInfo.address) {
    targetState = getStateShortName(lastClickedInfo.address);
  }

  const [extractedData, timeOfData] = extractDataByTypeFromOverview(
    state.xhr.overviewData,
    targetState || "",
    state.filter.datesRange
  );

  const innerData = extractedData.find((data) => data.name === "Confirmed");
  const outerData = extractedData.filter((data) => data.name !== "Confirmed");

  return { innerData, outerData, targetState, timeOfData };
};

const PieChart = connect(
  mapStateToProps,
  null,
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
  })
)(PieChartComponent);

export { PieChart };
