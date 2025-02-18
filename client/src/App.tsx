import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Settings from "./pages/settings";
import Analytics from "./pages/Analytics";
import Chatbot from "./pages/chatbot";
import Devices from "./pages/devices";
import "./index.css";
import React from "react";

const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/devices", element: <Devices /> },
  { path: "/settings", element: <Settings /> },
  { path: "/analytics", element: <Analytics /> },
  { path: "/chatbot", element: <Chatbot /> },
]);

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with Improved Styling */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-700 text-white shadow-md fixed h-full hidden md:flex flex-col">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto ml-0 md:ml-64 p-6">
        <RouterProvider router={router} />
      </main>
    </div>
  );
}

export default App;
