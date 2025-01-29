import { CardContent, Card } from '@mui/material';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import React, { useEffect, useState } from "react";
import PercentCard from "../components/PercentCard";
import Graph from "../components/Graph";
import StatCard from "../components/StatCard";

// Define the types of the data
interface Metric {
  title: string;
  value: string;
  subtitle?: string;
}

interface EmissionCategory {
  label: string;
  value: number;
  color: string;
}

interface MetricsResponse {
  metricsData: Metric[];
  emissionCategories: {
    most: EmissionCategory[];
    least: EmissionCategory[];
  };
}

export default function Analytics() {
  const [timeFrame, setTimeFrame] = useState('All-Time');
  const [device, setDevice] = useState('all');
  const [graph, setGraph] = useState(false);
  const [metricsData, setMetricsData] = useState<Metric[]>([]); // State to hold fetched metrics data
  const [emissionCategories, setEmissionCategories] = useState<{ most: EmissionCategory[], least: EmissionCategory[] }>({ most: [], least: [] }); // State for emission categories
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/metrics"); // Change the URL accordingly
        const data: MetricsResponse = await response.json();

        // Update the state with the fetched data
        setMetricsData(data.metricsData);
        setEmissionCategories(data.emissionCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once when the component mounts

  // Show loading state until data is fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">Loading data, please wait...</div>
      </div>
    );
  }

  return graph ? (
    <div className="gap-6 p-6 w-full h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Display Stat Cards */}
      {metricsData.map((metric, index) => (
        <div key={index} className="flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-200">
          <StatCard persent={''} trend={'up'} data={[]} {...metric} />
        </div>
      ))}
      
      {/* Graph Component */}
      <div className="col-span-4 bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl" onClick={() => setGraph(true)}>
        <Graph />
      </div>
    </div>
  ) : (
    <div className="h-screen bg-gray-50 ml-10">
      <div className="min-w-full mx-auto p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Analytics</h1>
        
        {/* Timeframe and Device Selection */}
        

          {/* Device Dropdown */}
          
       
        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {metricsData.map((metric, index) => (
            <Card key={index} className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <div className="flex items-baseline">
                    <span className="text-xl font-semibold">{metric.value}</span>
                    {metric.subtitle && (
                      <span className="text-xs text-gray-500 ml-2">{metric.subtitle}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Graph Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 cursor-pointer hover:shadow-lg" onClick={() => setGraph(true)}>
          <Graph />
        </div>

        {/* Emission Category Percent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <PercentCard title="Most Emission-Intensive Category" stats={emissionCategories.most} />
          <PercentCard title="Least Emission-Intensive Category" stats={emissionCategories.least} />
        </div>
      </div>
    </div>
  );
}
