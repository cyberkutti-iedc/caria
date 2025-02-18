import React, { useState } from "react";
import SensorGraph from "../components/SensorGraph";
import { Fullscreen, LucideFullscreen } from "lucide-react"; // Using Lucide Icons for better Tailwind support

// Define available graph types
const graphOptions = [
  { key: "AQI_PM10", label: "AQI PM10" },
  { key: "AQI_PM2_5", label: "AQI PM2.5" },
  { key: "CO2_ppm", label: "CO2 (ppm)" },
  { key: "CO_ppb", label: "CO (ppb)" },
  { key: "Humidity_Percent", label: "Humidity (%)" },
  { key: "NO2_ppb", label: "NO2 (ppb)" },
  { key: "O3_ppb", label: "O3 (ppb)" },
  { key: "Overall_AQI", label: "Overall AQI" },
  { key: "PM10_ugm3", label: "PM10 (µg/m³)" },
  { key: "PM2_5_ugm3", label: "PM2.5 (µg/m³)" },
  { key: "SO2_ppb", label: "SO2 (ppb)" },
  { key: "Temperature_C", label: "Temperature (°C)" },
];

export default function Analytics() {
  const [selectedGraphs, setSelectedGraphs] = useState<string[]>(["Overall_AQI"]);
  const [gridVisible, setGridVisible] = useState(true);
  const [yScale, setYScale] = useState<"linear" | "logarithmic">("linear");
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <button onClick={() => setFullscreen(!fullscreen)} className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
          {fullscreen ? <LucideFullscreen className="w-6 h-6" /> : <Fullscreen className="w-6 h-6" />}
        </button>
      </div>

      {/* Controls Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Graph Selection */}
        <div className="relative">
          <label className="block text-gray-700 text-sm font-medium mb-2">Select Graphs</label>
          <select
            multiple
            value={selectedGraphs}
            onChange={(e) => setSelectedGraphs(Array.from(e.target.selectedOptions, (option) => option.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          >
            {graphOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid Toggle */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 text-sm font-medium">Show Grid</label>
          <input
            type="checkbox"
            checked={gridVisible}
            onChange={() => setGridVisible(!gridVisible)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Y-Axis Scale Selector */}
        <div className="relative">
          <label className="block text-gray-700 text-sm font-medium mb-2">Y-Axis Scale</label>
          <select
            value={yScale}
            onChange={(e) => setYScale(e.target.value as "linear" | "logarithmic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="linear">Linear</option>
            <option value="logarithmic">Logarithmic</option>
          </select>
        </div>
      </div>

      {/* Graph Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
        <SensorGraph selectedGraphs={selectedGraphs} gridVisible={gridVisible} yScale={yScale} />
      </div>

      {/* Fullscreen Mode */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl">
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              <LucideFullscreen className="w-6 h-6" />
            </button>
            <SensorGraph selectedGraphs={selectedGraphs} gridVisible={gridVisible} yScale={yScale} />
          </div>
        </div>
      )}
    </div>
  );
}
