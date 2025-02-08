import { getDatabase, ref, set } from "firebase/database";
import { db } from "./config/firebaseConfig";

// Define the personal information object
export const personalInfo = {
    name: "Vishnu",
    username: "vava",
    phoneNumber: "+1 515 599 9655",
    email: "alexmarshall2022@gmail.com",
};

// Define the metrics data and emission categories
export const metricsData = [
    {
        title: "Active Devices",
        value: "1",
        subtitle: "/5",
    },
    {
        title: "Emissions by devices",
        value: "3,298",
    },
    {
        title: "Av. Session Length",
        value: "10h 54m",
    },
    {
        title: "Total emission",
        value: "546kg",
        subtitle: "Out of 43",
    },
    {
        title: "Carbon emissions",
        value: "86%",
    },
    {
        title: "Total Reduction",
        value: "+34%",
    },
];

export const emissionCategories = {
    most: [
        { label: "c20", value: 74, color: "bg-red-500" },
        { label: "N20", value: 52, color: "bg-red-500" },
        { label: "HNo3", value: 36, color: "bg-red-500" },
    ],
    least: [
        { label: "c02", value: 95, color: "bg-green-500" },
        { label: "h20", value: 92, color: "bg-green-500" },
        { label: "h3", value: 89, color: "bg-green-500" },
    ],
};

// Define the Emissions data object
export const Emissions = {
    labels: [
        "0", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
        {
            label: "Carbon Emissions",
            data: [0, 12, 1, 3, 5, 2, 3, 9, 13, 4, 9, 18, 9],
            borderColor: "#FF4DCA",
            tension: 0.3,
            pointStyle: "line",
        },
        {
            label: "FL5 Emissions",
            data: [0, 13, 4, 9, 18, 9, 7, 11, 12, 19, 3, 5, 2],
            borderColor: "#3EB7E5",
            tension: 0.3,
            pointStyle: "line",
        },
        {
            label: "Methane Emissions",
            data: [0, 10, 15, 8, 12, 6, 4, 10, 14, 7, 10, 15, 8],
            borderColor: "#F68D7D",
            tension: 0.3,
            pointStyle: "line",
        },
    ],
};

// Define the devices data
export const devices = [
    {
        name: "Device A",
        deviceId: "12345",
        batteryPercentage: 85,
        charging: true,
        serviceMode: false,
        online: true,
        controllers: 2,
        cores: 8,
        sensors: ["Temperature", "Humidity", "Motion"]
    },
    {
        name: "Device B",
        deviceId: "67890",
        batteryPercentage: 20,
        charging: false,
        serviceMode: true,
        online: false,
        controllers: 1,
        cores: 4,
        sensors: ["Temperature", "Pressure"]
    },
    {
        name: "Device C",
        deviceId: "54321",
        batteryPercentage: 50,
        charging: true,
        serviceMode: false,
        online: true,
        controllers: 3,
        cores: 6,
        sensors: ["Temperature", "Motion"]
    },
];

// Define the data object
export const data = [
    {
        title: 'CO2',
        value: '14k',
        persent: '+9',
        trend: 'up',
        data: [
            200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
            360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
        ],
    },
    {
        title: 'NO2',
        value: '325',
        persent: '-5.23%',
        trend: 'down',
        data: [
            1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
            780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
        ],
    },
    {
        title: 'CH4',
        value: '200k',
        persent: '+12.5%',
        trend: 'neutral',
        data: [
            500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
            520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
        ],
    },
];

export const atom_Data = [
    { label: "Temperature", value: 52, color: "bg-blue-500" },
    { label: "Humidity", value: 10, color: "bg-blue-500" },
    { label: "Water Level", value: 17, color: "bg-blue-500" },
  ];
  

// Function to upload all data to Firebase
const uploadAllData = async () => {
    const personalInfoRef = ref(db, '/personalInfo');
    const metricsRef = ref(db, '/metrics');
    const emissionsRef = ref(db, '/emissions');
    const devicesRef = ref(db, '/devices');
    const dataRef = ref(db, '/data'); // Path for the new data export
    const atom_DataRef = ref(db, '/atom_Data'); // Path for the new data export

    try {
        // Upload personal info to Firebase
        await set(personalInfoRef, personalInfo);
        console.log("✅ Personal information uploaded successfully to Firebase!");

        // Upload metrics data and emission categories to Firebase
        await set(metricsRef, {
            metricsData,
            emissionCategories,
        });
        console.log("✅ Metrics data and emission categories uploaded successfully to Firebase!");

        // Upload emissions data to Firebase
        await set(emissionsRef, Emissions);
        console.log("✅ Emissions data uploaded successfully to Firebase!");

        // Upload devices data to Firebase
        await set(devicesRef, devices);
        console.log("✅ Devices data uploaded successfully to Firebase!");

        // Upload data to Firebase
        await set(dataRef, data);
        console.log("✅ Data uploaded successfully to Firebase!");

        await set(atom_DataRef, atom_Data);
        console.log("✅ Atom Data uploaded successfully to Firebase!");

    } catch (error) {
        console.error("❌ Error uploading data to Firebase:", error);
    }
};

// Call the upload function
uploadAllData();
