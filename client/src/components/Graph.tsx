import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchEmission } from "../data/CHART_DATA";// ✅ Correct import

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function Graph() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Load the Emissions data into the chart
    fetchEmission().then(data => setChartData(data));
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0)", // Hide grid lines
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0)", // Hide grid lines
        },
        ticks: {
          stepSize: 4,
          beginAtZero: true,
          callback: function (tickValue: string | number) {
            return tickValue === 0 ? "" : tickValue; // Hide 0 tick label
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 5,
          boxHeight: 5,
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      {chartData.datasets.length > 0 ? (
        <Line options={options} data={chartData} />
      ) : (
        <p className="text-center">No data available for the graph.</p>
      )}
    </div>
  );
}
