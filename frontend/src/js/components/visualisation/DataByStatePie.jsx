import React, { Component } from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import {
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  PieChart as RechartPie,
} from "recharts";

import { Covid19DataCategorySelector } from "../gadgets/Covid19DataCategorySelector";
import { Covid19DataTypeSwitch } from "../gadgets/Covid19DataTypeSwitch";

import { extractMostRecentDataOfStateByCategory } from "../../utils/overviewDataExtraction";
import { STATE_COLOR_MAPPING } from "../../constants/states";

const VISUALISATION_NAME = "dataByStates";

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

class DataByStatePieComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }

  render() {
    const { timeOfData, data } = this.props;

    return (
      <Card
        hoverable
        className="col-6"
        title={`Covid-19 Data Composition By State ${
          timeOfData ? ` (${timeOfData})` : ""
        }`}
      >
        <section className={"data-switch-row"}>
          <Covid19DataCategorySelector visualisationName={VISUALISATION_NAME} />
          <Covid19DataTypeSwitch visualisationName={VISUALISATION_NAME} />
        </section>

        <ResponsiveContainer>
          <RechartPie width={400} height={400}>
            <Pie
              data={data}
              dataKey="value"
              startAngle={180}
              endAngle={-180}
              outerRadius={120}
              activeIndex={this.state.activeIndex}
              activeShape={renderActiveShape}
              isAnimationActive={false}
              onMouseEnter={(_, index, e) => {
                this.setState({
                  activeIndex: index,
                });
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`slice-${index}`}
                  fill={STATE_COLOR_MAPPING.get(entry.name)}
                />
              ))}
            </Pie>
          </RechartPie>
        </ResponsiveContainer>
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
}

const mapStateToProps = (state) => {
  const [data, timeOfData] = extractMostRecentDataOfStateByCategory(
    state.xhr.overviewData,
    state.filter.dataCategoriesByVisualisationNames[VISUALISATION_NAME],
    state.filter.dataTypesByVisualisationNames[VISUALISATION_NAME],
    state.filter.datesRange
  );

  return { data, timeOfData };
};

const DataByStatePie = connect(
  mapStateToProps,
  null,
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
  })
)(DataByStatePieComponent);

export { DataByStatePie };
