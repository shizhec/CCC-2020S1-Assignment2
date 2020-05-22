import React, { Component } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

class VerticalBarChart extends Component {
  render() {
    const data = [
      {
        name: "Confirmed",
        value: 4000,
      },
      {
        name: "Deaths",
        value: 46,
      },
      {
        name: "Cured",
        value: 2612,
      },
      {
        name: "Active",
        value: 418,
      },
    ];

    return (
      <div>
        <BarChart width={600} height={250} data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={80} />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#8884d8"
            barSize={40}
            animationDuration={4000}
            name="Number"
          />
        </BarChart>
      </div>
    );
  }
}

export { VerticalBarChart };
