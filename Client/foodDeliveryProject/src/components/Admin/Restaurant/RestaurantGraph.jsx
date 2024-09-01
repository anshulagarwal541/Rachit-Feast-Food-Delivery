import React from 'react'
import LineCharts from '../Home/LineChart'
import BarChartIcon from '@mui/icons-material/BarChart';
function RestaurantGraph() {
    return (
        <div className='bg-indigo-50 h-[100vh] relative flex gap-5 items-center px-5'>
            <div className='w-[45rem] h-[35rem] flex justify-center items-center flex-col'>
                <div className='relative flex justify-start w-full h-1/2'><div className='bg-indigo-950 rounded-full w-[5rem] h-[5rem]'></div></div>
                <div className='absolute backdrop-blur-sm bg-indigo-100/80 w-[40rem] h-[30rem] px-5 flex justify-center items-center rounded-xl'>
                    <LineCharts />
                </div>
                <div className='flex justify-end items-end w-full h-1/2'><div className='bg-indigo-950 rounded-full w-[5rem] h-[5rem]'></div></div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-10 py-3'>
                    <p className='font-bold text-xl'>Total Orders</p>
                    <p>654</p>
                    <BarChartIcon />
                </div>
                <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-10 py-3'>
                    <p className='font-bold text-xl'>COD Orders</p>
                    <p>654</p>
                    <BarChartIcon />
                </div>
                <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-10 py-3'>
                    <p className='font-bold text-xl'>Total Sales</p>
                    <p>654</p>
                    <BarChartIcon />
                </div>
                <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-10 py-3'>
                    <p className='font-bold text-xl'>COD Sales</p>
                    <p>654</p>
                    <BarChartIcon />
                </div>

            </div>
        </div>
    )
}

export default RestaurantGraph