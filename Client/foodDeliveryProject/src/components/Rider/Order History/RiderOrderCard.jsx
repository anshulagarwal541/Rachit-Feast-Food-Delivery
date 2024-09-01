import React, { useContext } from 'react'
import { AuthContext } from '../../../Helpers/AuthContext';
import { Link } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";

function RiderOrderCard({ order }) {
    const { url, rider, orders } = useContext(AuthContext);
    return (
        <>
            {order && (
                <div className='w-full md:w-[80%] lg:w-[60%] xl:w-[50%] rounded-2xl bg-indigo-950 text-white px-4 py-5 flex flex-col md:flex-row justify-between gap-5 md:gap-10'>
                    <div className='flex flex-col gap-3 md:gap-5'>
                        <p className='font-bold text-lg md:text-xl'><span className='text-yellow-400'>Order No :-</span> {order.orderNo}</p>
                        <p className='font-bold text-lg md:text-xl'><span className='text-yellow-400'>Order Time :-</span> {order.orderTime}</p>
                        <p className='font-bold text-lg md:text-xl'><span className='text-yellow-400'>Restaurant :-</span> {order.restaurant.name}</p>
                    </div>
                    <div className='flex flex-col gap-3 md:gap-5'>
                        <div className='w-full'>
                            <ReactStars
                                count={5}
                                size={24}
                                value={order.riderRating ? order.riderRating.rating : 0}
                                edit={false}
                                activeColor="#facc15"
                            />
                        </div>
                        <p className='font-bold text-lg md:text-xl'><span className='text-yellow-400'>Rating Received :-</span> {order.riderRating ? order.riderRating.rating : 0} / 5.0</p>
                        <p className='font-bold text-lg md:text-xl'><span className='text-yellow-400'>Money Earned :-</span> Rs {200 + (order.tip ? order.tip : 0)}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default RiderOrderCard;
