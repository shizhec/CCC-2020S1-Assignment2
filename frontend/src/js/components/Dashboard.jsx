import React, { Component } from "react";
import { Row, Col, Card } from "antd";

import "antd/dist/antd.min.css";

import { VerticalBarChart } from "./visualisation/VerticalBarChart";
import { SimplePieChart } from "./visualisation/SimplePieChart";
import { SimpleLineChart } from "./visualisation/SimpleLineChart";
import { CovidLegend } from "./visualisation/CovidLegend";

class Dashboard extends Component {
  render() {
    return (
      <Row>
        <Col span={12}>
          <Card hoverable className="col-6" title="Data In Bar Chart">
            <VerticalBarChart />
          </Card>
        </Col>
        <Col span={12}>
          <Card hoverable className="col-6" title="Data In Bar Chart">
            <SimplePieChart />
          </Card>
        </Col>
        <Col span={12}>
          <Card hoverable className="col-6" title={`Covid-19 Trends In Australia`}>
            <div style={{ height: "90%" }}>
              <SimpleLineChart />
            </div>
            <CovidLegend />
          </Card>
        </Col>
      </Row>
    );
  }
}

export { Dashboard };
