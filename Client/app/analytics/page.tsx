"use client";  // Add this line to indicate client-side rendering

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { fetchSensors, fetchMetrics } from "@/lib/api/apiClient";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Analytics() {
  const [timeRange, setTimeRange] = React.useState("90d");
  
  interface ChartDataItem {
    date: string;
    CO2_ppm: number;
    CO_ppb: number;
    O3_ppb: number;
    NO2_ppb: number;
    SO2_ppb: number;
    PM2_5_ugm3: number;
    PM10_ugm3: number;
    AQI_PM2_5: number;
    AQI_PM10: number;
    Overall_AQI: number;
    Temperature_C: number;
    Humidity_Percent: number;
  }

  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [metrics, setMetrics] = React.useState(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [showGrid, setShowGrid] = React.useState(true);  // State for toggling grid
  const [selectedGases, setSelectedGases] = React.useState<(keyof ChartDataItem)[]>(["CO2_ppm"]); // Default selected gas

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const getYAxisLabel = (gas: keyof ChartDataItem) => {
    const units: Record<keyof ChartDataItem, string> = {
      CO2_ppm: "CO₂ (ppm)",
      CO_ppb: "CO (ppb)",
      O3_ppb: "O₃ (ppb)",
      NO2_ppb: "NO₂ (ppb)",
      SO2_ppb: "SO₂ (ppb)",
      PM2_5_ugm3: "PM2.5 (µg/m³)",
      PM10_ugm3: "PM10 (µg/m³)",
      AQI_PM2_5: "AQI PM2.5",
      AQI_PM10: "AQI PM10",
      Overall_AQI: "Overall AQI",
      Temperature_C: "Temperature (°C)",
      Humidity_Percent: "Humidity (%)",
      date: "Date"
    };
    return units[gas] || gas;
  };

  type GasType = keyof typeof gasColorConfig;
  const gasColorConfig: Record<string, { color: string; label: string }> = {
    CO2_ppm: { color: "hsl(352, 92%, 38%)", label: "CO2" },
    CO_ppb: { color: "hsl(209, 92%, 38%)", label: "CO" },
    O3_ppb: { color: "hsl(147, 92%, 38%)", label: "O3" },
    NO2_ppb: { color: "hsl(271, 92%, 38%)", label: "NO2" },
    SO2_ppb: { color: "hsl(33, 92%, 38%)", label: "SO2" },
    PM2_5_ugm3: { color: "hsl(180, 92%, 38%)", label: "PM2.5" },
    PM10_ugm3: { color: "hsl(314, 92%, 38%)", label: "PM10" },
    AQI_PM2_5: { color: "hsl(45, 92%, 38%)", label: "AQI PM2.5" },
    AQI_PM10: { color: "hsl(236, 92%, 38%)", label: "AQI PM10" },
    Overall_AQI: { color: "hsl(120, 92%, 38%)", label: "Overall AQI" },
  };

  const formatData = (data: any[]): ChartDataItem[] => {
    return data.map((item) => ({
      date: item.Date,
      CO2_ppm: item.CO2_ppm,
      CO_ppb: item.CO_ppb,
      O3_ppb: item.O3_ppb,
      NO2_ppb: item.NO2_ppb,
      SO2_ppb: item.SO2_ppb,
      PM2_5_ugm3: item.PM2_5_ugm3,
      PM10_ugm3: item.PM10_ugm3,
      AQI_PM2_5: item.AQI_PM2_5,
      AQI_PM10: item.AQI_PM10,
      Overall_AQI: item.Overall_AQI,
      Temperature_C: item.Temperature_C,
      Humidity_Percent: item.Humidity_Percent,
    }));
  };

  const gasOptions = [
    { value: "CO2_ppm", label: "CO2 (ppm)" },
    { value: "CO_ppb", label: "CO (ppb)" },
    { value: "O3_ppb", label: "O3 (ppb)" },
    { value: "NO2_ppb", label: "NO2 (ppb)" },
    { value: "SO2_ppb", label: "SO2 (ppb)" },
    { value: "PM2_5_ugm3", label: "PM2.5 (µg/m³)" },
    { value: "PM10_ugm3", label: "PM10 (µg/m³)" },
    { value: "AQI_PM2_5", label: "AQI PM2.5" },
    { value: "AQI_PM10", label: "AQI PM10" },
    { value: "Overall_AQI", label: "Overall AQI" },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [sensorData, metricsData] = await Promise.all([
          fetchSensors(),
          fetchMetrics(),
        ]);

        if (sensorData) {
          const formattedData = formatData(sensorData);
          setChartData(formattedData);
        }

        if (metricsData) {
          setMetrics(metricsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const today = new Date();
    let daysToSubtract = 90;
    
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToSubtract);

    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>All Gases  - Interactive</CardTitle>
          <CardDescription>
            Showing data for the selected gas over the last {timeRange === "90d" ? "3 months" : timeRange}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
            <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
            <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
          </SelectContent>
        </Select>

        <Select
  value={selectedGases[0] || ''}
  onValueChange={(value) => setSelectedGases([value] as (keyof ChartDataItem)[])}
>
  <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select gases">
    <SelectValue placeholder="Select parameters" />
  </SelectTrigger>
  <SelectContent className="rounded-xl">
    {gasOptions.map((gas) => (
      <SelectItem key={gas.value} value={gas.value} className="rounded-lg">
        {gas.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


        <Button onClick={toggleGrid}>
          {showGrid ? "Hide Grid" : "Show Grid"}
        </Button>
      </CardHeader>

      <CardContent className={`px-2 pt-4 sm:px-6 sm:pt-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <ChartContainer
            config={chartConfig}
            className={`aspect-auto ${isFullScreen ? 'h-[calc(100vh-120px)]' : 'h-[250px]'} w-full`}
          >
          <AreaChart data={filteredData}>
  <defs>
    {selectedGases.map((gas) => (
      <linearGradient key={gas} id={`fill${gas}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={gasColorConfig[gas]?.color} stopOpacity={0.8} />
        <stop offset="95%" stopColor={gasColorConfig[gas]?.color} stopOpacity={0.1} />
      </linearGradient>
    ))}
  </defs>
  <CartesianGrid vertical={false} />
  <YAxis
    label={{
      value: getYAxisLabel(selectedGases[0]),
      angle: -90,
      position: 'insideLeft',
      style: { textAnchor: 'middle' },
    }}
    tickLine={false}
    axisLine={false}
    tickMargin={8}
  />
  <XAxis
    dataKey="date"
    tickLine={false}
    axisLine={false}
    tickMargin={8}
    minTickGap={32}
    tickFormatter={(value) => {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }}
  />
  <ChartTooltip
    cursor={false}
    content={
      <ChartTooltipContent
        labelFormatter={(value) => {
          return new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        }}
        indicator="dot"
      />
    }
  />
  {selectedGases.map((gas) => (
    <Area
      key={gas}
      dataKey={gas}
      type="natural"
      fill={`url(#fill${gas})`}
      stroke={gasColorConfig[gas]?.color}
      stackId="a"
    />
  ))}
  <ChartLegend content={<ChartLegendContent />} />
</AreaChart>


          </ChartContainer>


          
        </div>
      </CardContent>


{/* overall aqi */}


<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>AQI Chart - Interactive</CardTitle>
          <CardDescription>
            Showing data for AQI over the last {timeRange === "90d" ? "3 months" : timeRange}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
            <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
            <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={toggleGrid}>
          {showGrid ? "Hide Grid" : "Show Grid"}
        </Button>
      </CardHeader>

      <CardContent className={`px-2 pt-4 sm:px-6 sm:pt-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <ChartContainer
            config={chartConfig}
            className={`aspect-auto ${isFullScreen ? 'h-[calc(100vh-120px)]' : 'h-[250px]'} w-full`}
          >
           <AreaChart data={filteredData}>
  <defs>
    {/* Gradient for Overall_AQI */}
    <linearGradient id="fillOverall_AQI" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={gasColorConfig.Overall_AQI.color} stopOpacity={0.8} />
      <stop offset="95%" stopColor={gasColorConfig.Overall_AQI.color} stopOpacity={0.1} />
    </linearGradient>
  </defs>
  
  <CartesianGrid vertical={false} />
  <YAxis
    label={{
      value: getYAxisLabel("Overall_AQI"),
      angle: -90,
      position: 'insideLeft',
      style: { textAnchor: 'middle' },
    }}
    tickLine={false}
    axisLine={false}
    tickMargin={8}
  />
  <XAxis
    dataKey="date"
    tickLine={false}
    axisLine={false}
    tickMargin={8}
    minTickGap={32}
    tickFormatter={(value) => {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }}
  />
  
  <ChartTooltip
    cursor={false}
    content={
      <ChartTooltipContent
        labelFormatter={(value) => {
          return new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        }}
        indicator="dot"
      />
    }
  />
  
  {/* Plotting the Overall_AQI Area */}
  <Area
    dataKey="Overall_AQI"
    type="natural"
    fill="url(#fillOverall_AQI)" // Gradient for Overall_AQI
    stroke={gasColorConfig.Overall_AQI.color}
    stackId="a"
  />
  
  <ChartLegend content={<ChartLegendContent />} />
</AreaChart>

          </ChartContainer>
        </div>
      </CardContent>



      
{/* overall aqi */}


<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle> SO2 Chart - Interactive</CardTitle>
          <CardDescription>
            Showing data for SO2 over the last {timeRange === "90d" ? "3 months" : timeRange}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
            <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
            <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={toggleGrid}>
          {showGrid ? "Hide Grid" : "Show Grid"}
        </Button>
      </CardHeader>

      <CardContent className={`px-2 pt-4 sm:px-6 sm:pt-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <ChartContainer
            config={chartConfig}
            className={`aspect-auto ${isFullScreen ? 'h-[calc(100vh-120px)]' : 'h-[250px]'} w-full`}
          >
        <AreaChart data={filteredData}>
  <defs>
    {/* Gradient for SO2_ppb */}
    <linearGradient id="fillSO2_ppb" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={gasColorConfig.SO2_ppb.color} stopOpacity={0.8} />
      <stop offset="95%" stopColor={gasColorConfig.SO2_ppb.color} stopOpacity={0.1} />
    </linearGradient>
  </defs>
  
  <CartesianGrid vertical={false} />
  <YAxis
    label={{
      value: getYAxisLabel("SO2_ppb"),
      angle: -90,
      position: 'insideLeft',
      style: { textAnchor: 'middle' },
    }}
    tickLine={false}
    axisLine={false}
    tickMargin={8}
  />
  <XAxis
    dataKey="date"
    tickLine={false}
    axisLine={false}
    tickMargin={8}
    minTickGap={32}
    tickFormatter={(value) => {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }}
  />
  
  <ChartTooltip
    cursor={false}
    content={
      <ChartTooltipContent
        labelFormatter={(value) => {
          return new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        }}
        indicator="dot"
      />
    }
  />
  
  {/* Plotting the SO2_ppb Area */}
  <Area
    dataKey="SO2_ppb"
    type="natural"
    fill="url(#fillSO2_ppb)" // Gradient for SO2_ppb
    stroke={gasColorConfig.SO2_ppb.color}
    stackId="a"
  />
  
  <ChartLegend content={<ChartLegendContent />} />
</AreaChart>


          </ChartContainer>
        </div>
      </CardContent>
      
    </Card>



  );
}
