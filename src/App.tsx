import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Settings from "./pages/settings";
import Analatics from "./pages/Analytics";
import Chatbot from "./pages/chatbot";
import "./index.css";
import React from "react";
import Devices from "./pages/devices";

const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  {path: "/devices", element: <Devices />},
  { path: "/settings", element: <Settings /> },
  { path: "/analytics", element: <Analatics /> },
  { path: "/chatbot", element: <Chatbot /> },
]);

function App() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen w-64 bg-gray-800 text-white">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto h-screen">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
