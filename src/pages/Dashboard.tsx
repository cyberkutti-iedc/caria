import React from 'react'
import Calender from '../components/Calender.tsx'
import '@coreui/coreui-pro/dist/css/coreui.min.css';
import Graph from '../components/Graph.tsx';

function Dashboard() {
  return (
      <div className='grid grid-cols-6 grid-rows-6 gap-4 p-4 w-full h-screen'>
        <div className='row-span-1 col-span-1 bg-slate-300'></div>
        <div className='row-span-1 col-span-1 bg-slate-300'></div>
        <div className='row-span-1 col-span-1 bg-slate-300'></div>
        <div className='row-span-3 col-span-4 border-2 p-2 rounded border-slate-300'><Graph /></div>
        <div className='row-span-3 col-span-2'><Calender /></div>
        <div className='row-span-3 col-span-3 bg-slate-500'></div>
        <div className='row-span-3 col-span-2 col-start-5'></div>
      </div>
  )
}
export default Dashboard
