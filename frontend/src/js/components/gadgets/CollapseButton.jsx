/**
 * COMP90024 Cluster and Cloud Computing Team 12
 *
 * @Author: Haowen Shen
 * Email: haoshen@student.unimelb.edu.au
 */
import React from "react";
import { Button } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";

export function CollapseButton({ onClickHandler }) {
  return (
    <Button
      icon={<DoubleRightOutlined />}
      className={"collapse-btn"}
      onClick={onClickHandler}
    />
  );
}
