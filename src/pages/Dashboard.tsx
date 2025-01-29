import React, { useEffect, useState } from 'react'; 
import Calender from '../components/Calender';
import '@coreui/coreui-pro/dist/css/coreui.min.css';
import Graph from '../components/Graph';
import StatCard, { StatCardProps } from '../components/StatCard';
import PercentCard from '../components/PercentCard';

import { fetchStatData } from '../data/STAT_DATA';
import { fetchData } from '../data/PERCENT_PROP';
import { fetchEmission } from '../data/CHART_DATA'; // ✅ Corrected import

// Define types
interface Stat {
  label: string;
  value: number;
  color: string;
}

interface Emission {
  title: string;
  value: string;
  persent: string;
  trend: string;
}

function Dashboard() {
  const [statData, setStatData] = useState<StatCardProps[] | null>(null);
  const [dashStats, setDashStats] = useState<Stat[]>([{ label: "Loading...", value: 0, color: "" }]);
  const [emissionData, setEmissionData] = useState<Emission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedStatData, fetchedDashStats, fetchedEmissions] = await Promise.all([
          fetchStatData(),
          fetchData(),
          fetchEmission(),
        ]);

        setStatData(fetchedStatData);
        setDashStats(fetchedDashStats);
        setEmissionData(fetchedEmissions);
      } catch (error) {
        console.error("Error loading data:", error);
        setStatData([]);
        setDashStats([]);
        setEmissionData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!statData || statData.length === 0) {
    return <div className="flex items-center justify-center h-screen">No data available</div>;
  }

  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-3 p-3  h-screen ml-10"> {/* Added mr-4 here for right margin */}
      {/* Stat Cards */}
      {statData.map((stat, index) => (
        <div key={index} className="row-span-1 col-span-1 bg-white border rounded border-slate-300 shadow-md">
          <StatCard {...stat} />
        </div>
      ))}

      {/* Graph */}
      <div className="row-span-3 col-span-4 bg-white border p-2 rounded border-slate-300 shadow-md">
        <Graph />
      </div>

      {/* Calendar */}
      <div className="row-span-4 col-span-2 bg-white border p-1 rounded border-slate-300 mb-5 shadow-md">
        <Calender />
      </div>

      {/* Percentage Stats */}
      <div className="row-span-2 col-span-3 bg-white pb-3">
        <PercentCard title="Outcome Statistics" stats={dashStats} />
      </div>

      {/* Emissions Data */}
      <div className="row-span-2 col-span-3 bg-white p-4 shadow-md rounded-md border">
        <h2 className="text-xl font-semibold mb-2">Emissions Data</h2>
        {emissionData.length > 0 ? (
          <ul className="space-y-2">
            {emissionData.map((emission, index) => (
              <li key={index} className="p-2 border rounded-md bg-gray-100">
                <strong>{emission.title}:</strong> {emission.value} ({emission.persent}, {emission.trend})
              </li>
            ))}
          </ul>
        ) : (
          <p>No emissions data available.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
