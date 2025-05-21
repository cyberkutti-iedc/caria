"use client";

import { useEffect, useState } from "react";
import { fetchDeviceInfo } from "@/lib/api/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BatteryFull, BatteryCharging, WifiOff, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function DevicePage() {
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadDeviceInfo() {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchDeviceInfo();
      if (result) {
        setDevice(result);
      } else {
        throw new Error("Invalid device data");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-900 dark:text-gray-100">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-4xl font-bold mb-4"
      >
        📡 Device Status
      </motion.h1>

      {/* 🔴 Error Alert (Server Down) */}
      {error && (
        <Alert className="mt-6 w-full max-w-3xl border-red-500 text-red-600 dark:border-red-400 dark:text-red-300">
          <WifiOff className="h-5 w-5" />
          <AlertTitle>Device Not Connected</AlertTitle>
          <AlertDescription>Failed to retrieve device information. Please check your network.</AlertDescription>
          <Button onClick={loadDeviceInfo} className="mt-3 flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" /> Retry Now
          </Button>
        </Alert>
      )}

      {/* 📊 Device Info */}
      {loading ? (
        <p className="mt-6 text-gray-600 dark:text-gray-400">Loading device data...</p>
      ) : device && !error ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl"
        >
          <Card className="w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{device.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Device ID:</strong> {device.deviceId}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Controllers:</strong> {device.controllers}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Cores:</strong> {device.cores}
              </p>
              <p className={`text-lg font-semibold ${device.online ? "text-green-600" : "text-red-500"}`}>
                {device.online ? "✅ Online" : "❌ Offline"}
              </p>
            </CardContent>
          </Card>

          {/* 🔋 Battery Status Card */}
          <Card className="w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Battery Status 
                {device.charging ? <BatteryCharging className="text-green-500" /> : <BatteryFull className="text-gray-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Battery Level:</strong> {device.batteryPercentage}%
              </p>
              <Progress value={device.batteryPercentage} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <p className="mt-6 text-red-500">Failed to load device information.</p>
      )}
    </div>
  );
}
