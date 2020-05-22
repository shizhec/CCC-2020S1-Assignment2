import React, { Component } from "react";
import { Row, Col, Card } from "antd";
import "antd/dist/antd.min.css";
import { VerticalBarChart } from "./visualisation/VerticalBarChart";
import { SimplePieChart } from "./visualisation/SimplePieChart";

class Dashboard extends Component {
  render() {
    return (
      <Row>
        <Col span={12}>
          <Card hoverable className="col-6" title="Card One">
            <VerticalBarChart />
          </Card>
        </Col>
        <Col span={12}>
          <Card hoverable className="col-6" title="Card Two">
            <SimplePieChart />
          </Card>
        </Col>
      </Row>
    );
  }
}

export { Dashboard };
