

export const fetchEmission = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/emissions'); // Ensure correct API URL
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const Emissions_data = await response.json();
    console.log('Fetched data:', Emissions_data); // Log the fetched data
    return Emissions_data; // Return data instead of modifying a variable
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array in case of failure
  }
};
