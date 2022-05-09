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

const Chart = () => {
  return (
    <>
      <Line
        width={300}
        height={200}
        responsive={true}
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "months",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: "red",
            },
          ],
        }}
      />
    </>
  )
}
export default Chart