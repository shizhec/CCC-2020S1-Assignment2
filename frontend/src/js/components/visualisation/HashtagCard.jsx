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
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { getCityName, getStateName } from "../../utils/googleMap";
import { randomHexColorCode } from "../../utils/color";

class HashtagCardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }

  render() {
    // console.log("In HashtagCard, this.props =", this.props);
    const { cityName, stateName, hashtagCount, data } = this.props;

    let title = "Tweet Sentiment Data";
    if (cityName && stateName) {
      title = `${title} - ${cityName}, ${stateName}`;
    }

    return (
      <Card hoverable className="col-6 tweet-card xhr-data-card" title={title}>
        <div className={"data-presentation"}>
          <p>
            <span>
              <b>Number of Hashtags: </b>
            </span>
            {hashtagCount || "N/A"}
          </p>
        </div>
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
                <Cell key={`cell-${index}`} fill={randomHexColorCode()} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  }
}

const mapStateToProps = (state, { hashtagCount, hashtagOverview }) => {
  if (!hashtagCount && !hashtagOverview) {
    ({ hashtagCount, hashtagOverview } = state.xhr);
  }

  const { lastClickedInfo } = state.map;

  let cityName = "";
  let stateName = "";

  if (
    hashtagCount &&
    hashtagOverview &&
    lastClickedInfo &&
    lastClickedInfo.address
  ) {
    cityName = getCityName(lastClickedInfo.address);
    stateName = getStateName(lastClickedInfo.address);
  }

  let sortedTop10 = [];
  if (hashtagOverview && hashtagOverview.length > 0) {
    sortedTop10 = hashtagOverview.sort((a, b) => b[1] - a[1]);
    if (sortedTop10.length > 10) {
      sortedTop10 = sortedTop10.slice(0, 10);
    }
  }

  const data = sortedTop10.map(([name, value]) => ({ name, value }));

  return { hashtagCount, data, cityName, stateName };
};

const HashtagCard = connect(mapStateToProps)(HashtagCardComponent);

export { HashtagCard };
