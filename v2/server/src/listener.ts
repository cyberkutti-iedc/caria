import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "./config/firebaseConfig"; // Make sure this is the correct path to your firebase config

// Listener to read data from the database
const listenToAllData = () => {
    const personalInfoRef = ref(db, '/personalInfo');
    const metricsRef = ref(db, '/metrics');
    const emissionsRef = ref(db, '/emissions');
    const devicesRef = ref(db, '/devices');
    const dataRef = ref(db, '/data');

    // Set up the listener for personal info
    onValue(personalInfoRef, (snapshot) => {
        const personalInfo = snapshot.val();
        console.log("Personal Information:", personalInfo);
    });

    // Set up the listener for metrics and emission categories
    onValue(metricsRef, (snapshot) => {
        const metricsData = snapshot.val();
        console.log("Metrics Data and Emission Categories:", metricsData);
    });

    // Set up the listener for emissions data
    onValue(emissionsRef, (snapshot) => {
        const emissionsData = snapshot.val();
        console.log("Emissions Data:", emissionsData);
    });

    // Set up the listener for devices data
    onValue(devicesRef, (snapshot) => {
        const devicesData = snapshot.val();
        console.log("Devices Data:", devicesData);
    });

    // Set up the listener for other data
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        console.log("Data:", data);
    });
};

// Call the function to start listening to the data
listenToAllData();
