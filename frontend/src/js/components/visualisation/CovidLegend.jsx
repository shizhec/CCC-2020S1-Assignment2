import React from "react";
import { Legend } from "recharts";

import { COLOR_MAPPING } from "../../constants/covid19ColorMapping";

export function CovidLegend({ showTest = false }) {
  const legentData = [];
  COLOR_MAPPING.forEach((color, value) => {
    if (showTest || value !== "Tested") {
      legentData.push({ color, value });
    }
  });

  return (
    <div
      style={{
        position: "relative",
        height: "10%",
        width: "100%",
        marginTop: "1rem",
      }}
    >
      <Legend
        wrapperStyle={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        payload={legentData}
      />
    </div>
  );
}
