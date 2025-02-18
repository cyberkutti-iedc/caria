// src/data/PERCENT_PROP.ts

export const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/atom/data'); // Ensure correct API URL
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Fetched data:', data); // Log the fetched data for debugging
    return data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching data:', error); // Log error if fetching fails
    return []; // Return an empty array in case of failure
  }
};
