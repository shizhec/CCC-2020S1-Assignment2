import React, { Component } from "react";
import { Row, Col, Card } from "antd";
import "antd/dist/antd.min.css";

class Dashboard extends Component {
  render() {
    return (
      <Row>
        <Col span={12}>
          <Card hoverable className="col-6" title="Card One">
            Card 1
          </Card>
        </Col>
        <Col span={12}>
          <Card hoverable className="col-6" title="Card Two">
            Card 2
          </Card>
        </Col>
      </Row>
    );
  }
}

export { Dashboard };
