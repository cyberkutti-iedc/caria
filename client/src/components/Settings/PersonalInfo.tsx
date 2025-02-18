import React, { useEffect, useState } from "react";

export default function PersonalInfo() {
  const [personalInfo, setPersonalInfo] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch personal info from the server
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/info");
        const data = await response.json();
        setPersonalInfo(data);
      } catch (error) {
        console.error("Error fetching personal info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-500"></div>
        <span className="mt-4 text-xl text-gray-600">Loading...</span>
      </div>
    );
  }

  // Function to handle save button click
  const handleSave = () => {
    alert("Still Developing this feature");
  };

  return (
    <main className="w-full h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <div className="max-w-4xl mx-auto pt-16 px-4">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Personal Information</h2>
        </header>
        <p className="text-sm text-gray-600 mb-10 text-center">
          Provide your personal details so we can keep in touch.
        </p>

        {/* Personal Info Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {personalInfo ? (
            Object.entries(personalInfo).map(([label, value], index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
              >
                <p className="text-xs text-gray-600 font-medium uppercase">{label}</p>
                <p className="text-lg text-gray-900 font-semibold">{String(value)}</p>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No personal info available</div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-10 flex justify-center">
          <button
            className="w-72 h-14 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-lg hover:scale-105 transition-transform"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}
