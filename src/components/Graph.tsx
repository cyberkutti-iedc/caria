import React from 'react'
import { CHART_DATA } from '../data/CHART_DATA'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, plugins } from 'chart.js'


ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)


export default function Graph() {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0)'
                },
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0)'
                },
                ticks: {
                    stepSize: 4,
                    beginAtZero: true, // Start y-axis at 0
                    callback: function (tickValue: string | number) {
                        if (tickValue === 0) {
                            return ''; // Do not display the 0 tick label
                        }
                        return tickValue;
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 5, // Adjust the size of the circle
                    boxHeight: 5,
                    generateLabels: (chart: { data: any; isDatasetVisible: (arg0: any) => any }) => {
                        const data = chart.data;
                        return data.datasets.map((dataset: { label: any; borderColor: any }, i: any) => ({
                            text: dataset.label,
                            fillStyle: dataset.borderColor, // Use borderColor for fill
                            strokeStyle: dataset.borderColor, // Use borderColor for stroke
                            lineWidth: 1,
                            hidden: !chart.isDatasetVisible(i),
                            index: i,
                            pointStyle: 'circle'
                        }));
                    }
                }
            }
        }
    }

    return <Line options={options} data={CHART_DATA} />
}