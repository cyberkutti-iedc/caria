import React from 'react';

interface Stat {
  label: string;
  color: string;
  value: number;
}

interface PercentCardProps {
  title: string;
  stats: Stat[];
}

export default function PercentCard({ title, stats }: PercentCardProps) {
  if (stats.length === 0) {
    return (
      <div className="rounded-lg p-4 shadow-md bg-white w-full border border-slate-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Sorting to find highest and lowest values
  const sortedStats = [...stats].sort((a, b) => b.value - a.value);
  const highest = sortedStats[0];
  const lowest = sortedStats[sortedStats.length - 1];

  return (
    <div className="rounded-lg p-4 shadow-md bg-white w-full border border-slate-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      {/* Highest Value Highlight */}
      <div className="mb-4 p-3 rounded-md bg-red-100 border-l-4 border-red-500">
        <p className="text-sm font-bold text-red-700">Highest Emission</p>
        <p className="text-md font-semibold text-red-900">{highest.label}: {highest.value}%</p>
      </div>

      {stats.map((stat, index) => (
        <div key={index} className="flex items-center mb-4">
          {/* Details */}
          <div className="flex-1">
            <div className={`text-sm ${stat.label === highest.label ? 'font-bold text-red-700' : ''} 
                                       ${stat.label === lowest.label ? 'font-bold text-green-700' : 'text-gray-600'}`}>
              {stat.label}
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full mt-2">
              <div
                className={`absolute h-2 rounded-full`}
                style={{
                  width: `${Math.min(stat.value, 100)}%`,
                  backgroundColor: stat.color || '#3498db',
                }}
              ></div>
            </div>
          </div>
          {/* Percentage */}
          <div className="ml-3 text-sm font-semibold text-gray-700">{stat.value}%</div>
        </div>
      ))}

      {/* Lowest Value Highlight */}
      <div className="mt-4 p-3 rounded-md bg-green-100 border-l-4 border-green-500">
        <p className="text-sm font-bold text-green-700">Lowest Emission</p>
        <p className="text-md font-semibold text-green-900">{lowest.label}: {lowest.value}%</p>
      </div>
    </div>
  );
}
