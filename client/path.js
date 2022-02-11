import React from 'react';
import ReactDOM from 'react-dom';
import { Chart, Path } from 'bizcharts';

console.log(Path);

// source
const data = [
  { consumption: 0.65, price: 1, year: 1965 },
  { consumption: 0.66, price: 1.05, year: 1966 },
  { consumption: 0.64, price: 1.1, year: 1967 },
  { consumption: 0.63, price: 1.12, year: 1968 },
  { consumption: 0.55, price: 1.15, year: 1969 },
];

const scale={
	price:{
		min:0,
		max:1.5
	},
	year:{
		range:[0.05, 0.95]
	}
}

function Demo() {
  return <Chart height={200} autoFit data={data} scale={scale}>
    <Path
      animate={{
        appear: {
          animation: 'path-in',
          duration: 1000,
          easing: 'easeLinear',
        }
      }}
      shape="smooth"
      position="year*price"
    />
  </Chart>
}

ReactDOM.render(<Demo />, mountNode);

 
