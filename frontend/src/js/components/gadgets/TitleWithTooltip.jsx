import React from "react";
import { Tooltip } from "antd";

export function TitleWithTooltip({
  title,
  tooltipInfo,
  placement = "topLeft",
}) {
  return (
    <Tooltip title={tooltipInfo} placement={placement}>
      <h3>{title}</h3>
    </Tooltip>
  );
}
