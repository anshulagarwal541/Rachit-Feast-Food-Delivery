import React, { useContext, useEffect, useState } from 'react';
import { RiderHomePic2 } from '../../../../public';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import { AuthContext } from '../../../Helpers/AuthContext';

function RiderHomeComponent() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [rider, setRider] = useState(null);
    const [ratingData, setRatingData] = useState([]);
    const [moneyData, setMoneyData] = useState([]);
    const [totalItems, setTotalItems] = useState([])
    const [xLabels, setXLabels] = useState([]);

    useEffect(() => {
        axios.get(`${url}/rider`, {
            headers: {
                riderAccessToken: localStorage.getItem("riderAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRider(response.data);
                // Assuming the rider's data contains an array of orders with ratings and amount.
                const orders = response.data.orders;
                const ratings = orders.map(order => order.riderRating.rating);
                const moneyReceived = orders.map(order => order.tip); // Assuming 'amount' represents the money.
                const labels = orders.map((_, index) => `Order ${index + 1}`); // Creating labels based on order number.
                const items = orders.map(order => order.items.length);
                setTotalItems(items);
                setRatingData(ratings);
                setMoneyData(moneyReceived);
                setXLabels(labels);
            } else {
                console.log(response.data.error);
            }
        });
    }, [url]);

    const handleWithDraw = () => {
        axios.get(`${url}/rider/wallet/withdraw`, {
            headers: {
                riderAccessToken: localStorage.getItem('riderAccessToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage("Successfully put the withdraw request. Wait for the admin to accept it.!!")
                setRider(response.data)
            }
            else {
                setError(true)
                setErrorType("warning")
                setErrorMessage(response.data.error);
            }
        })
    }

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
                    <div className='flex gap-5 justify-center items-center'>
                        <p className='font-extrabold text-2xl md:text-3xl'>Rs {rider && rider.wallet}</p>
                        <button onClick={handleWithDraw} className='w-fit h-fit bg-indigo-950 text-white rounded px-5 py-2'>Withdraw</button>
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-center items-center p-5 md:p-10'>
                <div className='bg-indigo-50 w-full md:w-[45rem] h-fit rounded-2xl p-5 text-indigo-950'>
                    <LineChart
                        height={300}
                        series={[
                            { data: ratingData, label: 'Rating' },
                            { data: moneyData, label: 'Tip' },
                            { data: totalItems, label: 'Items Delivered' },
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
