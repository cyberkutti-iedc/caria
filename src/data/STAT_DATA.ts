import { StatCardProps } from '../components/StatCard'; 

// Define the API endpoint
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/data';

// Function to fetch data from the backend
export const fetchStatData = async (): Promise<StatCardProps[]> => {
  try {
    const response = await fetch(API_URL);

    // Check if the response is OK (status code 2xx)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse and return the data
    const data: StatCardProps[] = await response.json();
    return data;
  } catch (error) {
    // Log any error that occurs during the fetch operation
    console.error('Error fetching stat data:', error);
    return []; // Return an empty array in case of an error
  }
};

// A utility function to fetch and return the data
export const getStatData = async (): Promise<StatCardProps[]> => {
  const statData = await fetchStatData();
  return statData;
};
