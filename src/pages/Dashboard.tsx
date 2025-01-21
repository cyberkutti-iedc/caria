import React from 'react'
import Calender from '../components/Calender'
import '@coreui/coreui-pro/dist/css/coreui.min.css';
import Graph from '../components/Graph';
import StatCard from '../components/StatCard';
import data from '../data/STAT_DATA';
import { Dash_stats } from '../data/PERCENT_PROP';
import PercentCard from '../components/PercentCard';

function Dashboard() {
  return (
    <div className='grid grid-cols-6 grid-rows-6 gap-3 p-3 w-full h-screen'>
      <div className='row-span-1 col-span-1 bg-white border-1 rounded border-slate-300 shadow-md'><StatCard {...data[0]} /></div>
      <div className='row-span-1 col-span-1 bg-white border-1 rounded border-slate-300 shadow-md'><StatCard {...data[1]} /></div>
      <div className='row-span-1 col-span-1 bg-white border-1 rounded border-slate-300 shadow-md'><StatCard {...data[2]} /></div>
      <div className='row-span-3 col-span-4 bg-white border-1 p-2 rounded border-slate-300 shadow-md'><Graph /></div>
      <div className='row-span-4 col-span-2 bg-white border-1 p-1 rounded border-slate-300 mb-5 shadow-md'><Calender /></div>
      <div className='row-span-2 col-span-3 bg-white pb-3'><PercentCard title='Outcome Statistics' stats={Dash_stats} /></div>
    </div>
  )
}
export default Dashboard
