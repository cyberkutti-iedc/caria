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

export default function PercentCard({title, stats }: PercentCardProps) {


  return (
    <div className="rounded-lg pr-4 pl-4 shadow-md bg-white w-full border-1 border-slate-300">
      <h3 className="text-lg font-semibold text-gray-800 m-2">{title}</h3>
      {stats.map((stat, index) => (
        <div key={index} className="flex h-[full/4] items-center mb-3">
          {/* Icon */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg text-lg mr-3">
            {/* {stat.icon} */}
          </div>
          {/* Details */}
          <div className="flex-1">
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full mt-1">
              <div
                className={`absolute h-2 rounded-full ${stat.color}`}
                style={{ width: `${stat.value}%` }}
              ></div>
            </div>
          </div>
          {/* Percentage */}
          <div className="ml-3 text-sm font-semibold text-gray-700">{stat.value}%</div>
        </div>
      ))}
    </div>
  );
};

