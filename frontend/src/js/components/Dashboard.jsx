import React, { Component } from "react";
import { Row, Col } from "antd";

import "antd/dist/antd.min.css";

import { VerticalBarChart } from "./visualisation/VerticalBarChart";
import { PieChart } from "./visualisation/PieChart";
import { LineChart } from "./visualisation/LineChart";

class Dashboard extends Component {
  render() {
    return (
      <Row>
        <Col span={12}>
          <VerticalBarChart />
        </Col>
        <Col span={12}>
          <PieChart />
        </Col>
        <Col span={12}>
          <LineChart />
        </Col>
      </Row>
    );
  }
}

export { Dashboard };
