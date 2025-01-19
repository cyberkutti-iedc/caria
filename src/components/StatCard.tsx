
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import React from "react";


export type StatCardProps = {
    title: string;
    value: string;
    persent: string;
    trend: 'up' | 'down' | 'neutral';
    data: number[];
};

function AreaGradient({ color, id }: { color: string; id: string }) {
    return (
        <defs>
            <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        </defs>
    );
}

export default function StatCard({
    title,
    value,
    persent,
    trend,
    data,
}: StatCardProps) {
    return (
        <div className='grid grid-cols-2 grid-rows-2 gap-2 justify-center items-center text-center w-full h-full'>
            <h6 className='col-span-1 row-span-1 opacity-30 text-lg flex justify-center items-center mt-3'>{title}</h6>
            <div className='col-span-1 row-span-1 flex justify-center items-center mt-3'>
                <SparkLineChart
                    colors={trend === 'up' ? ['#FF4DCA'] : trend === 'down' ? ['#3EB7E5'] : ['#F68D7D']}
                    data={data}
                    area
                    height={30}
                    width={50}
                    sx={{
                        [`& .${areaElementClasses.root}`]: {
                            fill: `url(#area-gradient-${value})`,
                        },
                    }}
                >
                    <AreaGradient color={trend === 'up' ? '#FF4DCA' : trend === 'down' ? '#3EB7E5' : '#F68D7D'} id={`area-gradient-${value}`} />
                </SparkLineChart>
            </div>
            <h6 className='col-span-1 row-span-1 opacity-70 text-dark-1 text-base flex justify-center items-center mb-2'>{value}</h6>
            <h6 className='col-span-1 row-span-1 text-red-1 text-xs flex justify-center items-center mb-2'>{persent}</h6>
        </div>
    );
};