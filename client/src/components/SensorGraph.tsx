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
  ChartOptions,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface SensorGraphProps {
  selectedGraphs: string[];
  gridVisible: boolean;
  yScale: "linear" | "logarithmic"; // ✅ FIX: Restrict to valid values
}

export default function SensorGraph({ selectedGraphs, gridVisible, yScale }: SensorGraphProps) {
  interface SensorData {
    Date: string;
    Time: string;
    AQI_PM10?: number;
    AQI_PM2_5?: number;
    CO2_ppm?: number;
    CO_ppb?: number;
    Humidity_Percent?: number;
    NO2_ppb?: number;
    O3_ppb?: number;
    Overall_AQI?: number;
    PM10_ugm3?: number;
    PM2_5_ugm3?: number;
    SO2_ppb?: number;
    Temperature_C?: number;
  }

  const [chartData, setChartData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sensors/json");
        if (!response.ok) throw new Error("Failed to fetch data");

        const data: SensorData[] = await response.json();
        if (data.length === 0) throw new Error("No sensor data available");

        // ✅ FIX: Combine Date and Time for X-axis labels
        const labels = data.map((entry) => `${entry.Date} ${entry.Time}` || "N/A");

        // ✅ FIX: Explicitly define sensor keys with correct mapping
        const sensorKeys: Record<string, { label: string; color: string }> = {
          AQI_PM10: { label: "AQI PM10", color: "rgba(255, 99, 132, 1)" },
          AQI_PM2_5: { label: "AQI PM2.5", color: "rgba(54, 162, 235, 1)" },
          CO2_ppm: { label: "CO2 (ppm)", color: "rgba(255, 206, 86, 1)" },
          CO_ppb: { label: "CO (ppb)", color: "rgba(75, 192, 192, 1)" },
          Humidity_Percent: { label: "Humidity (%)", color: "rgba(153, 102, 255, 1)" },
          NO2_ppb: { label: "NO2 (ppb)", color: "rgba(255, 99, 132, 1)" },
          O3_ppb: { label: "O3 (ppb)", color: "rgba(54, 162, 235, 1)" },
          Overall_AQI: { label: "Overall AQI", color: "rgba(255, 206, 86, 1)" },
          PM10_ugm3: { label: "PM10 (µg/m³)", color: "rgba(75, 192, 192, 1)" },
          PM2_5_ugm3: { label: "PM2.5 (µg/m³)", color: "rgba(153, 102, 255, 1)" },
          SO2_ppb: { label: "SO2 (ppb)", color: "rgba(255, 159, 64, 1)" },
          Temperature_C: { label: "Temperature (°C)", color: "rgba(255, 99, 132, 1)" },
        };

        // ✅ FIX: TypeScript-safe way to generate datasets
        const datasets = selectedGraphs
          .filter((key) => sensorKeys[key]) // Only include valid keys
          .map((key) => ({
            label: sensorKeys[key].label,
            data: data.map((entry) => entry[key as keyof SensorData] ?? 0),
            borderColor: sensorKeys[key].color,
            backgroundColor: sensorKeys[key].color.replace("1)", "0.2)"),
            tension: 0.4,
          }));

        setChartData({ labels, datasets });
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
  }, [selectedGraphs]);

  // ✅ FIX: Correct `scales` type
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Date & Time" },
        grid: { display: gridVisible },
      },
      y: {
        title: { display: true, text: "Value" },
        type: yScale, // ✅ FIX: TypeScript-safe assignment
        grid: { display: gridVisible },
      },
    },
    plugins: {
      legend: { display: true, position: "top" },
    },
  };

  return (
    <div className="h-[500px] w-full flex justify-center items-center">
      {chartData.datasets.length > 0 ? <Line options={options} data={chartData} /> : <p>No data available.</p>}
    </div>
  );
}
