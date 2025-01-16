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
                    callback: function(value) {
                        if (value === 0) {
                            return ''; // Do not display the 0 tick label
                        }
                        return value;
                    }
                }
            }
        },
        plugins: {

        }
    }

    return <Line options={options} data={CHART_DATA} />
}

