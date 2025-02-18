import React from "react";
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

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export type StatCardProps = {
  title: string;
  value: string;
  persent: string;
  trend: "up" | "down" | "neutral";
  data: number[];
};

export default function StatCard({ title, value, persent, trend, data }: StatCardProps) {
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-blue-500" : "text-gray-500";

  const sparklineData = {
    labels: data.map((_, index) => index + 1),
    datasets: [
      {
        data: data,
        borderColor: trend === "up" ? "#FF4DCA" : trend === "down" ? "#3EB7E5" : "#F68D7D",
        backgroundColor: "transparent",
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center w-full">
      {/* Title */}
      <h6 className="text-gray-500 text-lg">{title}</h6>

      {/* Sparkline Graph */}
      <div className="w-[50px] h-[30px]">
        <Line data={sparklineData} options={options} />
      </div>

      {/* Value */}
      <h6 className="text-gray-900 font-semibold text-lg">{value}</h6>

      {/* Percentage */}
      <h6 className={`text-xs ${trendColor}`}>{persent}</h6>
    </div>
  );
}
