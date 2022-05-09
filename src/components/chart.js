import React from "react";
import { Line } from "react-chartjs-2";
import './Chart.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  plugins: {
    title:{
      display: true,
      text: 'Inbound Calls on Trunk VSBC'
    },
    legend: {
      position: 'bottom'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

function Chart(props) {
  console.log(props)
  console.log(props.trunk0data)
  console.log(props.trunk1data)
  console.log(props.trunk2data)
  console.log(props.TimeData)
  const teste = [1, 2, 3];
  console.log(teste)
  console.log(typeof teste)

  return (
    <>
      <div className="chart">
        <Line
          responsive={true}
          options={options}
          data={{
            labels: props.TimeData.slice(Math.max(props.TimeData.length - 10, 0)),
            datasets: [
              {
                label: "VMEdgeLG01",
                data: props.trunk0data.slice(Math.max(props.trunk0data.length - 10, 0)),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
              },
              {
                label: "VMEdgeLG02",
                data: props.trunk1data.slice(Math.max(props.trunk1data.length - 10, 0)),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
              {
                label: "VMEdgeLG03",
                data: props.trunk2data.slice(Math.max(props.trunk2data.length - 10, 0)),
                backgroundColor: "red",
                borderColor: '#4ee44e',
                backgroundColor: '#90ee90',
              }
            ],
          }}
        />
      </div>
    </>
  )
}
export default Chart