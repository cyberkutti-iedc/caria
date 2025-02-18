export const fetchEmission = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/emissions'); // Ensure correct API URL
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const emissionsData = await response.json(); // Parse the JSON data from the response
    console.log('Fetched emissions data:', emissionsData); // Log the fetched data for debugging
    return emissionsData; // Return the emissions data
  } catch (error) {
    console.error('Error fetching emissions data:', error); // Log error if fetching fails
    return { datasets: [], labels: [] }; // Return empty structure in case of failure
  }
};
