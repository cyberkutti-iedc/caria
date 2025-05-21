"use client"; // Ensure this component runs on the client side

import * as React from "react";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button"; // SHADCN Button component
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // Updated to exclude DialogAction
import { ChartContainer } from "@/components/ui/chart";
import { DialogTitle } from "@radix-ui/react-dialog"; // Import DialogTitle for proper accessibility
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // If you want to hi
interface DataItem {
  date: string;
  time: string;
  temperature: number;
  humidity: number;
  aqi: number;
}

const fetchData = async () => {
  const res = await fetch("http://localhost:8080/api/sensors/json");
  const data = await res.json();
  return data;
};

const downloadCSV = async () => {
  const res = await fetch("http://localhost:8080/api/sensors/csv");
  if (res.ok) {
    const data = await res.text();
    const blob = new Blob([data], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sensor_data.csv";
    link.click();
  } else {
    alert("Failed to download CSV");
  }
};

const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-2))",
  },
  aqi: {
    label: "AQI",
    color: "hsl(var(--chart-3))",
  },
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [data, setData] = React.useState<DataItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // Default to today's date
  const [openDialog, setOpenDialog] = useState(false); // Dialog state to control download confirmation
  const [deviceConnected, setDeviceConnected] = useState(true); // Device connected status
  const [newUpdates, setNewUpdates] = useState(false); // New updates status
  const [criticalErrors, setCriticalErrors] = useState(false); // Critical errors status

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      const apiData = await fetchData();
      const formattedData = apiData.map((item: { Date: string; Time: string; Temperature_C: number; Humidity_Percent: number; Overall_AQI: number; }) => {
        const dateTimeString = `${item.Date}T${item.Time}`;
        const dateTime = new Date(dateTimeString);
        return {
          date: dateTime,
          temperature: item.Temperature_C,
          humidity: item.Humidity_Percent,
          aqi: item.Overall_AQI,
        };
      });
      setData(formattedData);
    };

    fetchDataFromAPI();
  }, []);

  const getStartDate = () => {
    const currentDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "1d") {
      daysToSubtract = 1;
    }
    currentDate.setDate(currentDate.getDate() - daysToSubtract);
    return currentDate;
  };

  const filteredData = data.filter((item) => {
    return item.date >= getStartDate();
  });

  const CustomTooltip = ({ payload, label }: any) => {
    if (!payload || payload.length === 0) return null;

    const date = new Date(label);
    const dateString = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const timeString = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const { temperature, humidity, aqi } = payload[0].payload;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
        <p>{`Date: ${dateString}`}</p>
        <p>{`Time: ${timeString}`}</p>
        <p>{`Temperature: ${temperature} °C`}</p>
        <p>{`Humidity: ${humidity}%`}</p>
        <p>{`AQI: ${aqi}`}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Sensor Data Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Monitor and manage your environmental data in real-time</p>
      </div>

      {/* Device Status and Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Status */}
        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 text-center rounded-lg ${deviceConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {deviceConnected ? "Device Connected" : "Device Disconnected"}
            </div>
          </CardContent>
        </Card>

        {/* Updates Status */}
        <Card>
          <CardHeader>
            <CardTitle>New Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 text-center rounded-lg ${newUpdates ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
              {newUpdates ? "Yes, New Updates Available" : "No New Updates"}
            </div>
          </CardContent>
        </Card>

        {/* Critical Errors */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 text-center rounded-lg ${criticalErrors ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
              {criticalErrors ? "Yes, Critical Errors Detected" : "No Critical Errors"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Chart Section */}
      <Card className="dark:bg-card-bg dark:text-white w-full">
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1E90FF" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-humidity)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-humidity)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillAQI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-aqi)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-aqi)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const dateString = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  const timeString = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                  return `${dateString} ${timeString}`;
                }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area
                dataKey="temperature"
                type="natural"
                fill="url(#fillTemp)"
                stroke="#1E90FF"
                stackId="a"
              />
              <Area
                dataKey="humidity"
                type="natural"
                fill="url(#fillHumidity)"
                stroke="var(--color-humidity)"
                stackId="a"
              />
              <Area
                dataKey="aqi"
                type="natural"
                fill="url(#fillAQI)"
                stroke="var(--color-aqi)"
                stackId="a"
              />
              <Legend />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bottom Section with Download Button on the Left and Calendar on the Right */}
      <div className="flex justify-between space-x-4">
        {/* Left side: Download Button */}
        <div className="flex-1">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogTrigger asChild>
    <Button
      className="flex items-center space-x-2"
      onClick={() => setOpenDialog(true)}
    >
      <span>Download Full CSV</span>
    </Button>
  </DialogTrigger>
  <DialogContent>
    {/* Add a DialogTitle for accessibility */}
    <DialogTitle>
      <VisuallyHidden>Download CSV Confirmation</VisuallyHidden>
    </DialogTitle>
    <DialogHeader>
      <h3 className="text-lg font-semibold">Download CSV</h3>
      <DialogDescription>
        Are you sure you want to download the full sensor data in CSV format?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpenDialog(false)} className="mr-4">Cancel</Button>
      <Button
        onClick={() => {
          downloadCSV();
          setOpenDialog(false);
        }}
        className="bg-blue-500 text-white"
      >
        Yes, Download
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
        </div>

        {/* Right side: Calendar */}
        <div className="w-1/3">
          <Card className="dark:bg-card-bg dark:text-white">
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <h3 className="text-lg font-semibold mb-4">Select Date:</h3>
              <Calendar
                selected={selectedDate}
                onChange={(date: Date) => setSelectedDate(date)}
                dateFormat="yyyy/MM/dd"
                className="mb-6 p-4 rounded-lg border"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
