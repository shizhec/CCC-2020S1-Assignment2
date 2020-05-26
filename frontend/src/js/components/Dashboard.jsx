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
} from "./visualisation/";
import { TweetCard } from "./visualisation/TweetCard";
import { SentimentCard } from "./visualisation/SentimentCard";

function DashboardComponent({ aurin, tweetCount, coronaCount, sentiment }) {
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
    </Row>
  );
}

const mapStateToProps = (state) => {
  const { aurin, tweetCount, coronaCount, sentiment } = state.xhr;

  return { aurin, tweetCount, coronaCount, sentiment };
};

const Dashboard = connect(mapStateToProps)(DashboardComponent);

export { Dashboard };
