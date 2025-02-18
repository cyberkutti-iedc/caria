import React, { useEffect, useState } from "react";
import Calender from "../components/Calender";
import Graph from "../components/Graph";
import StatCard, { StatCardProps } from "../components/StatCard";
import PercentCard from "../components/PercentCard";
import { Line } from "react-chartjs-2";
import { Download } from "lucide-react";
import { fetchStatData } from "../data/STAT_DATA";
import { fetchData } from "../data/PERCENT_PROP";
import { fetchEmission } from "../data/CHART_DATA";

function Dashboard() {
  interface SensorData {
    Date: string;
    Time: string;
    CO2_ppm: number;
    Humidity_Percent: number;
    Overall_AQI: number;
    CO: number;
    CO2: number;
    SO2: number;
    O3: number;
  }

  const [statData, setStatData] = useState<StatCardProps[] | null>(null);
  interface MetricData {
    label: string;
    value: number;
    color: string;
  }
  const [metricsData, setMetricsData] = useState<MetricData[]>([]);
  const [emissionData, setEmissionData] = useState([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch emission stats from /api/metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/metrics");
        const data = await response.json();

        if (data?.emissionStats) {
          const transformedMetrics = data.emissionStats.map((stat: { type: string; max: any; }) => ({
            label: stat.type.replace(/_/g, " "), // Convert "CO2_ppm" to "CO2 ppm"
            value: stat.max, // Using max value as the metric
            color: getColorForType(stat.type), // Assign colors dynamically
          }));

          setMetricsData(transformedMetrics);
        } else {
          setMetricsData([]);
        }
      } catch (error) {
        console.error("Error fetching metrics data:", error);
        setMetricsData([]);
      }
    };

    fetchMetrics();
  }, []);

  // Fetch sensor data from /api/sensors/json
  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedStatData, fetchedDashStats, fetchedEmissions] = await Promise.all([
          fetchStatData(),
          fetchData(),
          fetchEmission(),
        ]);

        const response = await fetch("http://localhost:5000/api/sensors/json");
        const sensorData = await response.json();

        setStatData(fetchedStatData);
        setEmissionData(fetchedEmissions);
        setSensorData(sensorData);
      } catch (error) {
        console.error("Error loading data:", error);
        setStatData([]);
        setEmissionData([]);
        setSensorData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to assign a color dynamically based on the emission type
  const getColorForType = (type: string) => {
    const colorMap: { [key: string]: string } = {
      CO2_ppm: "#ff5722",
      NO2_ppb: "#ffcc00",
      CO_ppb: "#00cc99",
      SO2_ppb: "#3366ff",
    };
    return colorMap[type] || "#999999"; // Default color if type not found
  };

  // Create graph datasets dynamically
  const labels = sensorData.map((entry) => `${entry.Date} ${entry.Time}`);
  const createGraphDataset = (label: string, field: keyof SensorData, color: string) => ({
    label,
    data: sensorData.map((entry) => entry[field] || 0),
    borderColor: color,
    backgroundColor: color,
    tension: 0.3,
    pointRadius: 0,
  });

  const chartData = {
    labels,
    datasets: [
      createGraphDataset("CO2 ppm", "CO2_ppm", "rgba(255, 99, 132, 1)"),
      createGraphDataset("Humidity %", "Humidity_Percent", "rgba(54, 162, 235, 1)"),
      createGraphDataset("Overall AQI", "Overall_AQI", "rgba(255, 206, 86, 1)"),
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as "top" } },
    scales: { x: { title: { display: true, text: "Time" } }, y: { beginAtZero: true } },
  };

  const downloadCSV = () => {
    window.location.href = "http://localhost:5000/api/sensors/csv";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-500"></div>
        <span className="ml-4 text-xl text-gray-600">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 col-span-6">
        {statData?.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      <div className="md:col-span-4 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Real-Time Air Quality Data</h2>
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
        <Calender />
      </div>

      <div className="md:col-span-3 bg-white rounded-lg shadow-md p-4">
        <PercentCard title="Most Frequent Emissions" stats={metricsData} />
      </div>

      <div className="md:col-span-2 flex justify-center items-center">
        <button
          onClick={downloadCSV}
          className="w-48 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Download className="h-5 w-5" />
          Download CSV
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
