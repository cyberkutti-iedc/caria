import React, { useEffect, useState } from 'react';
import Calender from '../components/Calender';
import '@coreui/coreui-pro/dist/css/coreui.min.css';
import Graph from '../components/Graph';
import StatCard, { StatCardProps } from '../components/StatCard';
import PercentCard from '../components/PercentCard';

import { fetchStatData } from '../data/STAT_DATA';
import { fetchData } from '../data/PERCENT_PROP';
import { fetchEmission } from '../data/CHART_DATA';

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
  const [metricsData, setMetricsData] = useState<Stat[]>([]);
  const [emissionData, setEmissionData] = useState<Emission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetching metrics data
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();

        // Only extract the "most" data from the API response
        if (data && data.emissionCategories && data.emissionCategories.most) {
          setMetricsData(data.emissionCategories.most);
        }
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Fetching other data (stat data, dash stats, emissions)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Using Promise.all to fetch data in parallel
        const [fetchedStatData, fetchedDashStats, fetchedEmissions] = await Promise.all([
          fetchStatData(),
          fetchData(),
          fetchEmission(),
        ]);

        setStatData(fetchedStatData);
        setEmissionData(fetchedEmissions);
      } catch (error) {
        console.error('Error loading data:', error);
        setStatData([]); // Set empty arrays in case of an error
        setEmissionData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Loading state
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // No data state
  if (!statData || statData.length === 0) {
    return <div className="flex items-center justify-center h-screen">No data available</div>;
  }

  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-3 p-3 h-screen ml-10">
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
        <PercentCard title="Most Frequent Emissions" stats={metricsData} />
      </div>

      
    </div>
  );
}

export default Dashboard;
