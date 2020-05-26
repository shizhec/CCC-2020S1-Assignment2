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
