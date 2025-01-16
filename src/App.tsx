import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Settings from "./pages/settings.tsx";
// import Chatbot from "./pages/chatbot.tsx";
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
