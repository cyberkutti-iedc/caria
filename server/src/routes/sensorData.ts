import { Router, Request, Response } from "express";
import { ref, get } from "firebase/database";
import { db } from "../config/firebaseConfig";

const router = Router();

// ✅ Fetch all sensor data as JSON (Ordered by ID with Sl/No)
router.get("/json", async (req: Request, res: Response) => {
  try {
    const cariaRef = ref(db, "/caria");
    const snapshot = await get(cariaRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "No data found" });
    }

    const rawData = snapshot.val();
    const sortedKeys = Object.keys(rawData)
      .filter((key) => !isNaN(Number(key)))
      .sort((a, b) => Number(a) - Number(b));

    const lastEntryKey = "lastEntry";
    if (rawData[lastEntryKey]) {
      sortedKeys.push(lastEntryKey);
    }

    // Extract headers from first entry
    const firstEntryKey = sortedKeys[0];
    const firstEntry = rawData[firstEntryKey] || {};
    let headers = Object.keys(firstEntry);

    // Ensure Serial No, Date, and Time come first
    headers = ["Sl/No", "Date", "Time"].concat(
      headers.filter((h) => h !== "Date" && h !== "Time").sort()
    );

    const jsonData = sortedKeys.map((key, index) => {
      const entry = rawData[key] || {};
      const formattedEntry: any = { "Sl/No": index + 1 };

      headers.slice(1).forEach((header) => {
        formattedEntry[header] = entry[header] ?? "";
      });

      return formattedEntry;
    });

    res.json(jsonData);
  } catch (error) {
    console.error("Error fetching JSON data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Fetch all sensor data in a structured CSV format
router.get("/csv", async (req: Request, res: Response) => {
  try {
    const cariaRef = ref(db, "/caria");
    const snapshot = await get(cariaRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "No data found" });
    }

    const rawData = snapshot.val();
    const sortedKeys = Object.keys(rawData)
      .filter((key) => !isNaN(Number(key)))
      .sort((a, b) => Number(a) - Number(b));

    const lastEntryKey = "lastEntry";
    if (rawData[lastEntryKey]) {
      sortedKeys.push(lastEntryKey);
    }

    // Extract headers from first entry
    const firstEntryKey = sortedKeys[0];
    const firstEntry = rawData[firstEntryKey] || {};
    let headers = Object.keys(firstEntry);

    // Ensure Serial No, Date, and Time come first
    headers = ["Sl/No", "Date", "Time"].concat(
      headers.filter((h) => h !== "Date" && h !== "Time").sort()
    );

    // Convert data to CSV format
    let csvData = [headers.join(",")];

    sortedKeys.forEach((key, index) => {
      const entry = rawData[key] || {};
      const row = [index + 1]; // Add Serial No.

      headers.slice(1).forEach((header) => {
        row.push(entry[header] ?? ""); // Ensure missing fields are handled
      });

      csvData.push(row.join(","));
    });

    // Set response headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=sensor_data.csv");
    res.send(csvData.join("\n"));
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
