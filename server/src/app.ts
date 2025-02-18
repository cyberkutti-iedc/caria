import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sensorRoutes from "./routes/sensorData";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Sensor Data Routes
app.use("/api/sensors", sensorRoutes);

// Fetch and analyze sensor data
app.get("/api/metrics", async (req, res) => {
  try {
    const response = await fetch("http://localhost:5000/api/sensors/json");
    const sensorData = await response.json();

    const emissions = ["CO2_ppm", "NO2_ppb", "CO_ppb", "SO2_ppb"];
    
    let emissionStats = emissions.map(type => {
      const values = sensorData.map((entry: { [x: string]: any; }) => entry[type] || 0);
      return {
        type,
        max: Math.max(...values),
        min: Math.min(...values)
      };
    });

    res.json({ emissionStats });
  } catch (error) {
    console.error("Error fetching metrics data:", error);
    res.status(500).json({ error: "Failed to fetch emissions data." });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
