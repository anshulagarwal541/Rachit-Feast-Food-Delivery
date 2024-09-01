import React, { useContext, useEffect, useState } from 'react';
import { RiderHomePic2 } from '../../../../public';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import { AuthContext } from '../../../Helpers/AuthContext';

function RiderHomeComponent() {
    const { url } = useContext(AuthContext);
    const [rider, setRider] = useState(null);
    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const xLabels = [
        'Page A',
        'Page B',
        'Page C',
        'Page D',
        'Page E',
        'Page F',
        'Page G',
    ];

    useEffect(() => {
        axios.get(`${url}/rider`, {
            headers: {
                riderAccessToken: localStorage.getItem("riderAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRider(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    }, [url]);

    return (
        <div className='bg-indigo-950'>
            <div
                style={{ backgroundImage: `url(${RiderHomePic2})` }}
                className='relative w-full h-[100vh] bg-cover bg-center bg-no-repeat'
            >
                <div className='absolute inset-0 flex flex-col justify-center items-center text-white backdrop-brightness-50 gap-5'>
                    <p className='font-bold text-3xl md:text-6xl text-center'>
                        Welcome to <span className='text-yellow-500'>Rachit's Feast</span>
                    </p>
                    <p className='bg-yellow-500 text-black font-extrabold text-xl md:text-4xl px-5 py-3 rounded-2xl'>
                        Rider's Section
                    </p>
                    <div className='text-center'>
                        <p className='text-sm md:text-lg font-semibold'>
                            We provide a way to deliver your delicious meals at your doorstep.
                        </p>
                        <p className='text-sm md:text-lg font-semibold'>
                            Now there is no need to go out in hot weather and get tired.
                        </p>
                        <p className='text-sm md:text-lg font-semibold'>
                            Just order your meal now..
                        </p>
                    </div>
                </div>
            </div>
            <div className='p-5 md:p-10 flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10 text-indigo-950'>
                <div className='bg-indigo-50 border-4 border-yellow-400 w-full md:w-[20rem] p-5 rounded-2xl flex flex-col justify-center items-center gap-5'>
                    <p className='font-bold text-lg md:text-2xl'>Total Orders Delivered</p>
                    <p className='font-extrabold text-2xl md:text-3xl'>{rider && rider.orders.length}</p>
                </div>
                <div className='bg-indigo-50 border-4 border-yellow-400 w-full md:w-[20rem] p-5 rounded-2xl flex flex-col justify-center items-center gap-5'>
                    <p className='font-bold text-lg md:text-2xl'>Current Rating</p>
                    <p className='font-extrabold text-2xl md:text-3xl'>{rider && rider.totalRating}.0 / 5.0</p>
                </div>
                <div className='bg-indigo-50 border-4 border-yellow-400 w-full md:w-[20rem] p-5 rounded-2xl flex flex-col justify-center items-center gap-5'>
                    <p className='font-bold text-lg md:text-2xl'>Feast Wallet</p>
                    <p className='font-extrabold text-2xl md:text-3xl'>Rs {rider && rider.wallet}</p>
                </div>
            </div>
            <div className='w-full flex justify-center items-center p-5 md:p-10'>
                <div className='bg-indigo-50 w-full md:w-fit h-fit rounded-2xl p-5 text-indigo-950'>
                    <LineChart
                        height={300}
                        series={[
                            { data: pData, label: 'pv' },
                            { data: uData, label: 'uv' },
                        ]}
                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                        grid={{ vertical: true, horizontal: true }}
                    />
                </div>
            </div>
        </div>
    );
}

export default RiderHomeComponent;
