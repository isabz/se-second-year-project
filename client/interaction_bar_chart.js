import React from "react";
import { Chart, Interval, Interaction } from "bizcharts";

const data = [
  { year: "1951", sales: 38 },
  { year: "1952", sales: 52 },
  { year: "1956", sales: 61 },
  { year: "1957", sales: 45 },
  { year: "1958", sales: 48 },
  { year: "1959", sales: 38 },
  { year: "1960", sales: 38 },
  { year: "1962", sales: 38 },
];

function Demo() {
  return (
		<div style={{padding:'20px'}}>
			<Chart autoFit data={data} height={400} padding="auto">
				<Interval position="year*sales" />
				<Interaction type="element-highlight" />
				<Interaction type="active-region" />
			</Chart>
		</div>
  );
}

ReactDOM.render(<Demo />, mountNode);
