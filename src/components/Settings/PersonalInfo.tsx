import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useEffect, useState } from 'react';

export default function PersonalInfo() {
  const [personalInfo, setPersonalInfo] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch personal info from the server
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/info');
        const data = await response.json();
        setPersonalInfo(data); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching personal info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []); // Empty dependency array to run once on mount

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-transparent border-solid rounded-full text-blue-500"></div>
        <span className="ml-4 text-xl text-gray-600">Loading...</span>
      </div>
    );
  }

  // Function to handle save button click
  const handleSave = () => {
    alert("Still Developing this feature");
  };

  return (
    <main className="w-full h-screen bg-gradient-to-b from-[#e3f2fd] to-[#ffffff] p-8">
      <div className="max-w-[1016px] mx-auto pt-16 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-[36px] font-semibold text-[#333333] leading-9 mb-2">Settings</h1>
          <h2 className="text-[26px] font-semibold text-[#555555] leading-7">Personal Information</h2>
        </header>
        <p className="text-sm text-[#717171] mb-12 text-center">
          Provide your personal details so we can keep in touch.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {personalInfo.length > 0 ? (
            personalInfo.map((field, index) => (
              <Card
                key={index}
                className="bg-gradient-to-r from-[#d4e0ff] via-[#f0f7ff] to-[#e5f4ff] rounded-xl shadow-xl transition-all transform hover:scale-105 duration-300 ease-in-out"
              >
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 font-medium">{field.label}</p>
                    <p className="text-lg text-gray-900 font-semibold">{field.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No personal info available</div>
          )}
        </div>

        {/* Button section */}
        <div className="mt-10 flex justify-center">
          <Button
            className="w-[300px] h-14 bg-gradient-to-r from-[#4e73df] to-[#2e58c9] text-white font-medium rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
            size="large"
            onClick={handleSave} // Trigger alert on click
          >
            Save Changes
          </Button>
        </div>
      </div>
    </main>
  );
}
