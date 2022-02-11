import React from 'react';
import {
	Chart,
	Interval,
	Tooltip,
	Axis,
	Coordinate,
	Interaction
} from 'bizcharts';

function Labelline() {
	const data = [
		{ item: '1', count: 40, percent: 0.4 },
		{ item: '2', count: 21, percent: 0.21 },
		{ item: '3', count: 17, percent: 0.17 },
		{ item: '4', count: 13, percent: 0.13 },
		{ item: '5', count: 9, percent: 0.09 },
	];

	const cols = {
		percent: {
			formatter: val => {
				val = val * 100 + '%';
				return val;
			},
		},
	};


	return (
		<Chart height={400} data={data} scale={cols} autoFit onGetG2Instance={c => {
			c.geometries[0].elements.forEach((e, idx) => {
				e.setState('selected', idx === 0 ? true : false);
			})
		}}>
			<Coordinate type="theta" radius={0.75} />
			<Tooltip showTitle={false} />
			<Axis visible={false} />
			<Interval
				position="percent"
				adjust="stack"
				color="item"
				style={{
					lineWidth: 1,
					stroke: '#fff',
				}}
				label={['count', {
					content: (data) => {
						return `${data.item}: ${data.percent * 100}%`;
					},
				}]}
			/>
			<Interaction type='element-single-selected' />
		</Chart>
	);
}

ReactDOM.render(<Labelline />, mountNode);
