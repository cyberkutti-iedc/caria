// /lib/api/apiClient.ts

// Type for device information, adjust fields to match the actual structure from the API
// /lib/api/apiClient.ts

export interface DeviceInfo {
  deviceId: string;
  name: string;
  batteryPercentage: number;
  charging: boolean;
  controllers: number;
  cores: number;
  online: boolean;
}


// Type for sensors (adjust based on actual structure)
export interface Sensor {
  id: string;
  type: string;
  value: string;
}

// Type for metrics (adjust based on actual structure)
export interface Metric {
  name: string;
  value: number;
}

// Type for health status (adjust based on actual structure)
export interface HealthStatus {
  status: string;
  lastChecked: string;
}

export async function fetchDeviceInfo(): Promise<DeviceInfo | null> {
  try {
    const response = await fetch("http://localhost:8080/api/device?id=0");

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
}

export async function fetchSensors(): Promise<Sensor[] | null> {
  try {
    const response = await fetch("http://localhost:8080/api/sensors/json");

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
}

export async function fetchMetrics(): Promise<Metric[] | null> {
  try {
    const response = await fetch("http://localhost:8080/api/metrics");

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
}

// New function to fetch health status
export async function fetchHealthStatus(): Promise<HealthStatus | null> {
  try {
    const response = await fetch("http://localhost:8080/api/health");

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
}
