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
  Sector,
  PieChart as RechartPie,
} from "recharts";

import { getCityName, getStateName } from "../../utils/googleMap";

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
        {`Count: ${payload.value}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={40}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

class TweetCardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }

  render() {
    // console.log("In TweetCard, this.props =", this.props);
    const { cityName, stateName, tweetCount, coronaCount } = this.props;

    let title = "Tweet Data";
    if (cityName && stateName) {
      title = `${title} - ${cityName}, ${stateName}`;
    }

    const coronaRelatedName = "Coronavirus-related tweets";
    const data = [
      { name: coronaRelatedName, value: coronaCount },
      { name: "Other tweets", value: tweetCount - coronaCount },
    ];

    return (
      <Card hoverable className="col-6 tweet-card xhr-data-card" title={title}>
        <div className={"data-presentation"}>
          {tweetCount && (
            <p>
              <span>
                <b>Number of tweets: </b>
              </span>
              {tweetCount}
            </p>
          )}
          {coronaCount && (
            <p>
              <span>
                <b>Number of tweets related to Coronavirus: </b>
              </span>
              {coronaCount}
            </p>
          )}
        </div>
        <ResponsiveContainer height={"100%"} width={"70%"}>
          <RechartPie width={400} height={150} margin={{ left: 25, right: 25 }}>
            <Pie
              data={data}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
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
                  fill={
                    entry.name === coronaRelatedName ? "#a52a2a" : "#11c299"
                  }
                />
              ))}
            </Pie>
          </RechartPie>
        </ResponsiveContainer>
        {!tweetCount && !coronaCount && (
          <div className={"empty-data-cover"}>
            <h2>Oops, there are no tweet data available...</h2>
          </div>
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state, { tweetCount, coronaCount }) => {
  if (tweetCount && coronaCount) {
    return { tweetCount, coronaCount };
  }

  ({ tweetCount, coronaCount } = state.xhr);
  const { lastClickedInfo } = state.map;

  let cityName = "";
  let stateName = "";

  if (lastClickedInfo && lastClickedInfo.address) {
    cityName = getCityName(lastClickedInfo.address);
    stateName = getStateName(lastClickedInfo.address);
  }

  return { tweetCount, coronaCount, cityName, stateName };
};

const TweetCard = connect(mapStateToProps)(TweetCardComponent);

export { TweetCard };
