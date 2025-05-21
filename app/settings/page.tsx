"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Settings, Bell, ShieldCheck, Wrench } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [showMessage, setShowMessage] = useState(false);

  const handleFeatureClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000); // Hide after 3s
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-900 dark:text-gray-100">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-4xl font-bold mb-4"
      >
        ⚙️ Settings
      </motion.h1>
      
      {/* 🔔 Feature Coming Soon Message */}
      {showMessage && (
        <Alert className="mt-4 w-full max-w-md border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300">
          <Bell className="h-5 w-5" />
          <AlertTitle>Feature Coming Soon!</AlertTitle>
          <AlertDescription>We're working hard to bring this feature to you soon. Stay tuned! 🚀</AlertDescription>
        </Alert>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Security Settings */}
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="text-green-500" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Manage security settings and account protection.
            </p>
            <Button onClick={handleFeatureClick}>Manage Security</Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="text-gray-500" /> System Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Adjust system preferences and configurations.
            </p>
            <Button onClick={handleFeatureClick}>Open Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
