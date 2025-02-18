import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "../components/ui/Button"; // Assuming you have this component

interface Device {
  name: string;
  deviceId: string;
  batteryPercentage: number;
  charging: boolean;
  serviceMode: boolean;
  online: boolean;
  controllers: number;
  cores: number;
  sensors: string[];
  lastUpdated: Date; // Add a lastUpdated timestamp for each device
}

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to determine if it's day or night based on a timestamp
  const getDayOrNight = (currentTime: Date): string => {
    const hour = currentTime.getHours();
    return hour >= 6 && hour < 18 ? "Day" : "Night";
  };

  // Fetch device data from API
  useEffect(() => {
    const fetchDevices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/devices"); // Ensure this endpoint is correct
        const data: Device[] = await response.json();
        // Add the current time as lastUpdated for each device
        const updatedDevices = data.map((device) => ({
          ...device,
          lastUpdated: new Date(), // Assign current timestamp
        }));
        setDevices(updatedDevices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, []);

  // Open modal function
  const openModal = (device: Device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  // Format the last updated time for each device
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-indigo-100 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Device List</h1>

        {isLoading ? (
          <div className="text-center text-xl text-gray-600">Loading devices...</div>
        ) : (
          <>
            {/* Device Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => openModal(device)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-medium text-gray-900">{device.name}</div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        device.online ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {device.online ? "Online" : "Offline"}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span className="font-semibold">Device ID</span>
                      <span>{device.deviceId}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="font-semibold">Battery</span>
                      <span>{device.batteryPercentage}%</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="font-semibold">Charging</span>
                      <span>{device.charging ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="font-semibold">Service Mode</span>
                      <span>{device.serviceMode ? "Enabled" : "Disabled"}</span>
                    </div>

                    {/* Last Updated Info */}
                    <div className="flex justify-between text-gray-600">
                      <span className="font-semibold">Last Updated</span>
                      <span>
                        {formatDate(device.lastUpdated)} ({getDayOrNight(device.lastUpdated)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Device Details Modal */}
      {selectedDevice && (
        <Dialog open={isModalOpen} onClose={closeModal}>
          <Dialog.Panel className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="w-11/12 max-w-md bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Device Details - {selectedDevice.name}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span className="font-semibold">Device ID:</span>
                  <span>{selectedDevice.deviceId}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-semibold">Battery:</span>
                  <span>{selectedDevice.batteryPercentage}%</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-semibold">Charging:</span>
                  <span>{selectedDevice.charging ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-semibold">Service Mode:</span>
                  <span>{selectedDevice.serviceMode ? "Enabled" : "Disabled"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-semibold">Online Status:</span>
                  <span>{selectedDevice.online ? "Online" : "Offline"}</span>
                </div>

                {/* Additional Device Information */}
                <div className="flex justify-between text-gray-600">
                  <span className="font-semibold">Controllers:</span>
                  <span>{selectedDevice.controllers}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-semibold">Cores:</span>
                  <span>{selectedDevice.cores}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-semibold">Sensors:</span>
                  <span>{selectedDevice.sensors.join(", ")}</span>
                </div>
                {/* Last Updated Time for Modal */}
                <div className="flex justify-between text-gray-600">
                  <span className="font-semibold">Last Updated</span>
                  <span>
                    {formatDate(selectedDevice.lastUpdated)} ({getDayOrNight(selectedDevice.lastUpdated)})
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button onClick={closeModal} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                  Close
                </Button>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      )}
    </div>
  );
}
