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

function DashboardComponent({ lastClickedInfo }) {
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

      {lastClickedInfo && (
        <>
          <Col span={12}>
            <AurinCard />
          </Col>
          <Col span={12}>
            <TweetCard />
          </Col>
          <Col span={12}>
            <SentimentCard />
          </Col>
          <Col span={12}>
            <HashtagCard />
          </Col>
        </>
      )}
    </Row>
  );
}

const mapStateToProps = (state) => {
  const { lastClickedInfo } = state.map;

  return { lastClickedInfo };
};

const Dashboard = connect(mapStateToProps)(DashboardComponent);

export { Dashboard };
