import React, { useContext, useEffect, useState } from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
import RestaurantLineChart from './RestaurantLineChart';

function RestaurantGraph() {
    const { url } = useContext(AuthContext)
    const [riders, setRiders] = useState([])
    const [orders, setOrders] = useState([])
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {

        axios.get(`${url}/admin/allRestaurants`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRestaurants(response.data)
            }
        })

        axios.get(`${url}/admin/allRiders`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRiders(response.data)
            }
        })

        axios.get(`${url}/admin/allOrders`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setOrders(response.data)
            }
        })

    }, [])

    return (
        <AuthContext.Provider value={{ url }}>
            <div className='bg-indigo-50 py-10 min-h-[100vh] relative flex flex-col md:flex-row gap-5 items-center px-5'>
                <div className='px-5 w-full md:w-[45rem] h-[35rem] flex justify-center items-center flex-col'>
                    <div className='relative flex justify-start w-full h-1/2'>
                        <div className='bg-indigo-950 rounded-full w-[3rem] md:w-[5rem] h-[3rem] md:h-[5rem]'></div>
                    </div>
                    <div className='absolute backdrop-blur-sm bg-indigo-100/80 w-[95%] md:w-[40rem] h-[25rem] md:h-[30rem] px-5 flex justify-center items-center rounded-xl'>
                        <RestaurantLineChart />
                    </div>
                    <div className='flex justify-end items-end w-full h-1/2'>
                        <div className='bg-indigo-950 rounded-full w-[3rem] md:w-[5rem] h-[3rem] md:h-[5rem]'></div>
                    </div>
                </div>
                <div className='flex flex-col gap-4 w-full md:w-auto'>
                    <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-4 md:px-10 py-3'>
                        <p className='font-bold text-lg md:text-xl'>Total Orders</p>
                        <p>{orders && orders.length}</p>
                        <BarChartIcon />
                    </div>
                    <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-4 md:px-10 py-3'>
                        <p className='font-bold text-lg md:text-xl'>Total Restaurants</p>
                        <p>{restaurants && restaurants.length}</p>
                        <BarChartIcon />
                    </div>
                    <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-4 md:px-10 py-3'>
                        <p className='font-bold text-lg md:text-xl'>Total Riders</p>
                        <p>{riders && riders.length}</p>
                        <BarChartIcon />
                    </div>
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export default RestaurantGraph;
