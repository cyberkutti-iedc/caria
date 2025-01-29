import { StatCardProps } from '../components/StatCard';

// Define the API endpoint
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/data';

// Function to fetch data from the backend
export const fetchStatData = async (): Promise<StatCardProps[]> => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: StatCardProps[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stat data:', error);
    return []; // Return an empty array as a fallback
  }
};

// A utility function to fetch and return the data
export const getStatData = async () => {
  const statData = await fetchStatData();
  return statData;
};
