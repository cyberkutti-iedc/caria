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

  return (
    <div className="rounded-lg p-4 shadow-md bg-white w-full border border-slate-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center mb-4">
          {/* Icon Placeholder */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg text-lg mr-4">
            {/* {stat.icon} */}
          </div>
          {/* Details */}
          <div className="flex-1">
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full mt-2">
              <div
                className={`absolute h-2 rounded-full ${stat.color}`}
                style={{ width: `${Math.min(stat.value, 100)}%` }} // Ensuring value doesn't exceed 100
              ></div>
            </div>
          </div>
          {/* Percentage */}
          <div className="ml-3 text-sm font-semibold text-gray-700">{stat.value}%</div>
        </div>
      ))}
    </div>
  );
}
