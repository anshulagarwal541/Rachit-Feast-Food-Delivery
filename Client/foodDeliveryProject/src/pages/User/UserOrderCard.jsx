import React, { useContext } from 'react';
import { AuthContext } from '../../Helpers/AuthContext';
import { Link } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import axios from 'axios';

function UserOrderCard({ order }) {
    const { url, user, orders, setOrders, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);

    const ratingChanged = (newRating) => {
        const data = {
            rating: newRating,
            order: order
        }
        axios.post(`${url}/user/restaurant/rating`, data, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage("Successfully rated to restaurant...!!! :)")
                setOrders(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    };

    return (
        <>
            {order && (
                <div className='w-full md:w-[80%] lg:w-[60%] mx-auto rounded-2xl bg-indigo-950 text-white p-5 md:px-10 md:py-8 flex flex-col md:flex-row justify-between gap-10'>
                    <div className='flex flex-col gap-4 md:gap-5'>
                        <p className='font-bold text-lg md:text-2xl'>
                            <span className='text-yellow-400'>Order No: </span>{order.orderNo}
                        </p>
                        <p className='font-bold'>
                            <span className='text-yellow-400'>Order Time: </span>{order.orderTime}
                        </p>
                        <p className='font-bold'>
                            <span className='text-yellow-400'>Restaurant: </span>{order.restaurant.name}
                        </p>
                        <p className='font-bold'>
                            <span className='text-yellow-400'>Status: </span><br />{order.status}
                        </p>
                        <div className='flex items-center gap-3'>
                            <span className='text-yellow-400 font-bold'>Restaurant Rating: </span>
                            {order.restaurantRating ? (
                                <ReactStars
                                    count={5}
                                    value={order.restaurantRating.rating}
                                    edit={false}
                                    size={20}
                                    activeColor="#facc15"
                                />
                            ) : (
                                <ReactStars
                                    count={5}
                                    onChange={ratingChanged}
                                    size={20}
                                    activeColor="#facc15"
                                />
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 md:gap-5'>
                        {order.rider && (
                            <>
                                <p className='font-bold'>
                                    <span className='text-yellow-400'>Rider's Name: </span>{order.rider.name}
                                </p>
                                <p className='font-bold'>
                                    <span className='text-yellow-400'>Rider's Phone No: </span>{order.rider.phone}
                                </p>
                            </>
                        )}
                        <p className='font-bold'>
                            <span className='text-yellow-400'>Payment Mode: </span>{order.paymentMode}
                        </p>
                        <p className='font-bold'>
                            <span className='text-yellow-400'>Delivery Code: </span>{order.customerCode}
                        </p>
                        {user && (
                            <button className='bg-indigo-50 text-black font-bold rounded px-5 py-2 mt-3 md:mt-0'>
                                <Link to={`/user/${user._id}/orders/${order._id}`}>See Receipt</Link>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default UserOrderCard;
