import React from "react";
import ReactDOM from "react-dom";
import { Chart, Line, Point, Tooltip, Axis } from "bizcharts@4.0.10";

// source
const data = [
	{
		year: "1991",
		value: 3,
	},
	{
		year: "1992",
		value: 4,
	},
	{
		year: "1993",
		value: 3.5,
	},
];

function Demo() {
	return (
		<Chart
			padding={[10, 20, 50, 50]}
			autoFit
			height={500}
			data={data}
			scale={{ value: { min: 0 } }}
			// onLineMouseleave={console.log}
			// onPointClick={console.warn}
			onAxisLabelClick={(e => {
				const { axis } = e.gEvent.delegateObject;
				debugger
				alert(`you clicked axis: ${axis.get('field')}`)
			})}
		>
			<Line position="year*value"
				shape="smooth"
				style={{
					lineDash: [5,5]
				}}
			/>
			<Point position="year*value" />
			<Tooltip showCrosshairs lock triggerOn='click' />
			<Axis name='value' title={{
				position: 'center'
			}} />
		</Chart>
	);
}

ReactDOM.render(<Demo />, mountNode);
