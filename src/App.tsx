import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Settings from "./pages/settings";
// import Chatbot from "./pages/chatbot";
import "./index.css";
import React from "react";

const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/settings", element: <Settings /> },
  // { path: "/chatbot", element: <Chatbot /> },
]);
function App() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;