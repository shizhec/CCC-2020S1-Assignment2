/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "antd";

import "antd/dist/antd.min.css";

import {
  VerticalBarChart,
  DataByStatePie,
  PieChart,
  LineChart,
  AurinCard,
  HashtagCard,
  SentimentCard,
  TweetCard,
} from "./visualisation/";

function DashboardComponent({
  aurin,
  tweetCount,
  coronaCount,
  sentiment,
  hashtagCount,
  hashtagOverview,
}) {
  return (
    <Row>
      <Col span={12}>
        <LineChart />
      </Col>
      <Col span={12}>
        <DataByStatePie />
      </Col>
      <Col span={12}>
        <PieChart />
      </Col>
      <Col span={12}>
        <VerticalBarChart />
      </Col>
      {aurin && (
        <Col span={12}>
          <AurinCard />
        </Col>
      )}
      {tweetCount && coronaCount && (
        <Col span={12}>
          <TweetCard />
        </Col>
      )}
      {sentiment && (
        <Col span={12}>
          <SentimentCard />
        </Col>
      )}
      {hashtagCount && hashtagOverview && (
        <Col span={12}>
          <HashtagCard />
        </Col>
      )}
    </Row>
  );
}

const mapStateToProps = (state) => {
  const {
    aurin,
    tweetCount,
    coronaCount,
    sentiment,
    hashtagCount,
    hashtagOverview,
  } = state.xhr;

  return {
    aurin,
    tweetCount,
    coronaCount,
    sentiment,
    hashtagCount,
    hashtagOverview,
  };
};

const Dashboard = connect(mapStateToProps)(DashboardComponent);

export { Dashboard };
