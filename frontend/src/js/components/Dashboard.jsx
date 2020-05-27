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

function DashboardComponent({ aurin }) {
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
    </Row>
  );
}

const mapStateToProps = (state) => {
  const { aurin } = state.xhr;

  return { aurin };
};

const Dashboard = connect(mapStateToProps)(DashboardComponent);

export { Dashboard };
