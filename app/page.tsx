"use client";

import { useEffect, useState } from "react";
import { fetchMetrics } from "@/lib/api/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Bell, WifiOff, RefreshCcw } from "lucide-react";

export default function Home() {
  const [metrics, setMetrics] = useState<any>(null);
  const [highestEmission, setHighestEmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  async function loadMetrics() {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchMetrics();
      if (result) {
        setMetrics(result);

        // Find the highest emission value
        const highest = result.emissionStats.reduce((prev: any, current: any) =>
          prev.max > current.max ? prev : current
        );
        setHighestEmission(highest);

        // Reset retry count on success
        setRetryCount(0);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
      setRetryCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMetrics();

    // Auto-retry up to 5 times
    const interval = setInterval(() => {
      if (error && retryCount < 5) {
        loadMetrics();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [error, retryCount]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">🌍 Caria - Climate Action for Recovery of Integrated Air Quailty</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl">
        Track real-time air pollutants and carbon emissions And prediction.
      </p>

      {/* 🔴 Error Alert (Server Down) */}
      {error && (
        <Alert className="mt-6 w-full max-w-3xl border-red-500 text-red-600 dark:border-red-400 dark:text-red-300">
          <WifiOff className="h-5 w-5" />
          <AlertTitle>Server Connection Lost</AlertTitle>
          <AlertDescription>
            Unable to fetch emission data. Retrying... ({retryCount}/5)
          </AlertDescription>
          <Button onClick={loadMetrics} className="mt-3 flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" /> Retry Now
          </Button>
        </Alert>
      )}

      {/* 🟡 High Emission Warning */}
      {highestEmission && highestEmission.max > 300 && (
        <Alert className="mt-6 w-full max-w-3xl border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-300">
          <Bell className="h-5 w-5" />
          <AlertTitle>Warning: High Emissions Detected!</AlertTitle>
          <AlertDescription>
            <strong>{highestEmission.type.replace(/_/g, " ")}</strong> has reached **{highestEmission.max.toFixed(2)}**. 
            Consider reducing emissions.
          </AlertDescription>
        </Alert>
      )}

      {/* 📊 Emission Stats */}
      {loading ? (
        <p className="mt-6 text-gray-600 dark:text-gray-400">Loading emission data...</p>
      ) : metrics && !error ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl">
          {metrics.emissionStats.map((stat: any, index: number) => {
            const progressValue = (stat.max / 500) * 100;
            const isHighest = stat.type === highestEmission?.type;

            return (
              <Card
                key={index}
                className={`w-full shadow-md transition-all ${
                  isHighest ? "border-2 border-yellow-500 dark:border-yellow-400" : ""
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{stat.type.replace(/_/g, " ")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Max:</strong> {stat.max.toFixed(2)} | <strong>Min:</strong> {stat.min.toFixed(2)}
                  </p>
                  <Progress value={progressValue} className="h-3" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-red-500">Failed to load data.</p>
      )}
    </div>
  );
}
