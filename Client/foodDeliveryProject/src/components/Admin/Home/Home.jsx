import React, { useContext, useEffect, useState } from 'react';
import LineCharts from './LineChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import axios from 'axios';
import { AuthContext } from '../../../Helpers/AuthContext';

function Home() {
    const { url } = useContext(AuthContext)
    const [users, setUsers] = useState(null);
    const [restaurants, setRestaurants] = useState(null);
    const [vendors, setVendors] = useState(null);
    const [riders, setRiders] = useState([])
    const [orders, setOrders] = useState([])
    const [rest, setRest] = useState([]);

    useEffect(() => {

        axios.get(`${url}/admin/allRestaurants`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRest(response.data)
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
        <AuthContext.Provider value={{ riders, rest, orders, setRest, setOrders, setRiders, url }}>
            <div className='bg-indigo-50 min-h-screen flex flex-col justify-center lg:flex-row gap-5 items-center px-4 lg:px-8 py-8'>
                <div className='w-[80%] mx-auto h-[35rem] lg:w-[45rem] lg:h-[35rem] flex justify-center items-center flex-col relative rounded-2xl'>
                    {/* Top left circle */}
                    <div className='flex justify-start items-start w-full h-1/2'>
                        <div className='bg-indigo-950 rounded-full w-[5rem] h-[5rem] lg:w-[5rem] lg:h-[5rem]'></div>
                    </div>

                    {/* Chart Container */}
                    <div className='absolute inset-0 lg:static backdrop-blur-sm bg-indigo-100/80 w-full h-full px-5 flex justify-center items-center rounded-xl'>
                        <LineCharts />
                    </div>

                    {/* Bottom right circle */}
                    <div className='flex justify-end items-end w-full h-1/2 p-5'>
                        <div className='bg-indigo-950 rounded-full w-[5rem] h-[5rem] lg:w-[5rem] lg:h-[5rem]'></div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className='flex flex-wrap lg:flex-col gap-4 justify-center items-center w-full lg:w-auto'>
                    {/* Each card represents a stat */}
                    <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-6 py-3 w-full md:w-[10rem] lg:w-[15rem] md:h-[10rem] lg:h-[10rem]'>
                        <p className='font-bold text-center text-lg lg:text-xl w-fit'>Total Restaurants</p>
                        <p className=' w-fit'>{rest && rest.length}</p>
                        <BarChartIcon />
                    </div>
                    <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-6 py-3 w-full md:w-[10rem] lg:w-[15rem] md:h-[10rem] lg:h-[10rem]'>
                        <p className=' w-fit text-center font-bold text-lg lg:text-xl'>Total Riders</p>
                        <p className=' w-fit'>{riders && riders.length}</p>
                        <BarChartIcon />
                    </div>
                    <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-6 py-3 w-full md:w-[10rem] lg:w-[15rem] md:h-[10rem] lg:h-[10rem]'>
                        <p className=' w-fit text-center font-bold text-lg lg:text-xl'>Total Orders</p>
                        <p className=' w-fit'>{orders && orders.length}</p>
                        <BarChartIcon />
                    </div>
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export default Home;



// import React, { useEffect, useState } from 'react'
// import LineCharts from './LineChart'
// import BarChartIcon from '@mui/icons-material/BarChart';
// import axios from 'axios';
// function Home() {
//     const [users, setUsers] = useState(null);
//     const [restaurants, setRestaurants] = useState(null)
//     const [vendors, setVendors] = useState(null);

//     return (
//         <div className='bg-indigo-50 h-[100vh] relative flex gap-5 items-center px-5'>
//             <div className='w-[45rem] h-[35rem] flex justify-center items-center flex-col'>
//                 <div className='relative flex justify-start w-full h-1/2'><div className='bg-indigo-950 rounded-full w-[5rem] h-[5rem]'></div></div>
//                 <div className='absolute backdrop-blur-sm bg-indigo-100/80 w-[40rem] h-[30rem] px-5 flex justify-center items-center rounded-xl'>
//                     <LineCharts />
//                 </div>
//                 <div className='flex justify-end items-end w-full h-1/2'><div className='bg-indigo-950 rounded-full w-[5rem] h-[5rem]'></div></div>
//             </div>
//             <div className='flex flex-col gap-4'>
//                 <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-10 py-3'>
//                     <p className='font-bold text-xl'>Total Users</p>
//                     <p>654</p>
//                     <BarChartIcon />
//                 </div>
//                 <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-10 py-3'>
//                     <p className='font-bold text-xl'>Total Vendors</p>
//                     <p>654</p>
//                     <BarChartIcon />
//                 </div>
//                 <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-10 py-3'>
//                     <p className='font-bold text-xl'>Total Restaurants</p>
//                     <p>654</p>
//                     <BarChartIcon />
//                 </div>
//                 <div className='flex flex-col gap-2 justify-center items-center bg-white rounded-2xl px-10 py-3'>
//                     <p className='font-bold text-xl'>Total Riders</p>
//                     <p>654</p>
//                     <BarChartIcon />
//                 </div>

//             </div>
//         </div>
//     )
// }

// export default Home