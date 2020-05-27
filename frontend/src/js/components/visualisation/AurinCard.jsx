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

import {
  getCityName,
  getStateName,
  getStateShortName,
} from "../../utils/googleMap";

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

// "income_num(aud)": 697,
// "labour_force_num": 9030,
// "Participation_rate%": 54.2,
// "Unemployment_rate%": 5.1,
// "higher_education_rate%": 52.2,
// "Male": 5764,
// "Female": 5487

class AurinCardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }

  render() {
    console.log("In AurinCard, this.props =", this.props);
    const { cityName, stateName, aurin } = this.props;
    const {
      female,
      highedu,
      income,
      labor,
      male,
      participation,
      unemployment,
    } = aurin;

    const data = [
      { name: "Female", value: female },
      { name: "Male", value: male },
    ];

    let title = "Demographic Data";
    if (cityName && stateName) {
      title = `${title} - ${cityName}, ${stateName}`;
    }

    return (
      <Card hoverable className="col-6 aurin-card" title={title}>
        <div className={"data-presentation"}>
          {labor && (
            <p>
              <span>
                <b>Number of labour force: </b>
              </span>
              {labor}
            </p>
          )}
          {income && (
            <p>
              <span>
                <b>Average Income: </b>
              </span>
              ${income}
            </p>
          )}
          {highedu && (
            <p>
              <span>
                <b>Higher Education Rate: </b>
              </span>
              {highedu}%
            </p>
          )}
          {participation && (
            <p>
              <span>
                <b>Participation Rate: </b>
              </span>
              {participation}%
            </p>
          )}
          {unemployment && (
            <p>
              <span>
                <b>Unemployment Rate: </b>
              </span>
              {unemployment}%
            </p>
          )}
        </div>

        {female && male && (
          <ResponsiveContainer height={"100%"} width={"50%"}>
            <RechartPie width={300} height={150}>
              <Pie
                data={data}
                dataKey="value"
                startAngle={180}
                endAngle={-180}
                outerRadius={100}
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
                    fill={entry.name === "Female" ? "#fc8a88" : "#88c4fc"}
                  />
                ))}
              </Pie>
            </RechartPie>
          </ResponsiveContainer>
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  const { aurin } = state.xhr;
  const { lastClickedInfo } = state.map;

  let cityName = "";
  let stateName = "";

  if (lastClickedInfo && lastClickedInfo.address) {
    cityName = getCityName(lastClickedInfo.address);
    stateName = getStateName(lastClickedInfo.address);
  }

  return { aurin, cityName, stateName };
};

const AurinCard = connect(mapStateToProps)(AurinCardComponent);

export { AurinCard };
