import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "./config/firebaseConfig";

// Reference to the device path in the Realtime Database
const deviceRef = ref(db, '/');

// Function to fetch data every 3 seconds
const fetchDataEvery3Seconds = () => {
  // Set up interval to run every 3 seconds
  setInterval(() => {
    console.log("🔍 Fetching device value...");

    // Listen for changes at '/device'
    onValue(deviceRef, (snapshot) => {
      console.log("🧐 Snapshot exists:", snapshot.exists());  // Check if snapshot exists
      if (snapshot.exists()) {
        // Get and log the value if data exists
        const deviceValue = snapshot.val();
        console.log("📡 Real-time Device Value:", deviceValue);
      } else {
        // If no data exists at the path, log that as well
        console.log("⚠️ No data found at /device");
      }
    }, (error) => {
      // Log any error encountered during data fetching
      console.error("❌ Firebase Database Error:", error);
    });
  }, 3000); // Fetch every 3 seconds
};

// Initialize the function to fetch data
fetchDataEvery3Seconds();
