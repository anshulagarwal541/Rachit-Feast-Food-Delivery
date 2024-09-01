import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { foodDeliveryLogo } from '../../../../public'; // Assuming this path is correct
import { AuthContext } from '../../../Helpers/AuthContext';
import ReactStars from 'react-rating-stars-component';
import { Alert, Snackbar } from '@mui/material';

function OrderReceipt() {
    const { userId, orderId } = useParams();
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [riderRating, setRiderRating] = useState(null);
    const [restaurantRating, setRestaurantRating] = useState(null);

    useEffect(() => {
        axios.post(`${url}/user/orders`, {
            orderId: orderId
        }, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setOrder(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    }, []);

    const handleClose = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    const ratingChanged = (newRating) => {
        const data = {
            rating: newRating,
            order: order
        };
        axios.post(`${url}/user/rider/rating`, data, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setOrder(response.data);
                setError(true)
                setErrorType("success")
                setErrorMessage("Rider rated successfully..!! :)")
            } else {
                console.log(response.data.error);
            }
        });
    };

    const restaurantRatingChanged = (newRating) => {
        const data = {
            rating: newRating,
            order: order
        };
        axios.post(`${url}/user/restaurant/rating`, data, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setOrder(response.data);
                setError(true)
                setErrorType("success")
                setErrorMessage("Restaurant rated successfully..!! :)")
            } else {
                console.log(response.data.error);
            }
        });
    };

    return (
        <div className='h-fit bg-indigo-50 flex justify-center items-center px-5 md:px-10 py-10'>
            {error && (
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        open={error}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        key={"top" + "center"}
                    >
                        <Alert
                            onClose={handleClose}
                            severity={errorType}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {errorMessage}
                        </Alert>
                    </Snackbar>
                )}
            <div className='w-full md:w-3/4 lg:w-1/2 shadow-2xl h-fit p-5 md:p-10 bg-white rounded-lg'>
                <p className='w-full text-center text-xs mb-4'>Please take a screenshot you want. For any queries feel free to contact us.</p>
                <div className='flex justify-between items-center mb-6'>
                    <img src={foodDeliveryLogo} alt="food-delivery-logo" className='w-16 rounded-full' />
                    <p className='font-bold text-lg md:text-xl'>Rachit's Food Delivery Order Receipt</p>
                </div>
                {order && (
                    <>
                        <div className='flex flex-col gap-4 py-4'>
                            <div className='flex justify-between flex-wrap'>
                                <p className='font-semibold'><span className='text-lg font-semibold'>Order No</span> :- {order.orderNo}</p>
                                <p className='font-semibold'>{order.orderTime}</p>
                            </div>
                            <div className='flex justify-between flex-wrap'>
                                <p><span className='text-lg font-semibold'>Status</span> :- {order.status}</p>
                                {order.status === "completed" && (
                                    <div className='flex gap-3 items-center'>
                                        <span className='text-lg font-semibold'>Partner Rating</span> :-
                                        {order.riderRating ? (
                                            <ReactStars
                                                count={5}
                                                value={order.riderRating.rating}
                                                edit={false}
                                                size={24}
                                                activeColor="#d62727"
                                            />
                                        ) : (
                                            <ReactStars
                                                count={5}
                                                onChange={ratingChanged}
                                                size={24}
                                                activeColor="#d62727"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className='flex justify-between flex-wrap'>
                                <p><span className='text-lg font-semibold'>Restaurant</span> :- {order.restaurant && order.restaurant.name}</p>
                                {order.status === "completed" && (
                                    <div className='flex gap-3 items-center'>
                                        <span className='text-lg font-semibold'>Restaurant's Rating</span> :-
                                        {order.restaurantRating ? (
                                            <ReactStars
                                                count={5}
                                                value={order.restaurantRating.rating}
                                                edit={false}
                                                size={24}
                                                activeColor="#d62727"
                                            />
                                        ) : (
                                            <ReactStars
                                                count={5}
                                                onChange={restaurantRatingChanged}
                                                size={24}
                                                activeColor="#d62727"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                            <p><span className='text-lg font-semibold'>Restaurant Address</span> :- <br />
                                {order.restaurant.address}</p>
                        </div>
                        <div className='flex flex-col gap-2 py-2'>
                            <div className='flex justify-between flex-wrap'>
                                <p><span className='text-lg font-semibold'>Rider's Name</span> :- {order.rider ? order.rider.name : "Not Assigned"}</p>
                                <p><span className='text-lg font-semibold'>Rider's Phone No</span> :- {order.rider ? order.rider.phone : "N.A"}</p>
                            </div>
                            <p><span className='text-lg font-semibold'>Tip</span> :- Rs {order.tip}</p>
                            <div className='flex justify-between flex-wrap'>
                                <p><span className='text-lg font-semibold'>Payment Mode</span> :- COD</p>
                                <p><span className='text-lg font-semibold'>Status</span> :- {order.status}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 py-2'>
                            <div className='flex justify-between flex-wrap'>
                                <p><span className='text-lg font-semibold'>Coupon Name</span> :- {order.couponName ? order.couponName : "N.A"}</p>
                                <p><span className='text-lg font-semibold'>Discount</span> :- {order.couponDiscount ? order.couponDiscount : 0.0} Rs</p>
                            </div>
                            <p><span className='text-lg font-semibold'>Customer Name</span> :- {order.user.name}</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='text-lg font-semibold'>Items :-</p>
                            <div className='flex flex-col md:flex-row justify-evenly gap-5'>
                                <ol className='flex w-full md:w-1/2 flex-col list-disc px-5'>
                                    {order.items && order.items.map((item, i) => (
                                        <li key={i} className='font-semibold'>{item.item} :- Rs {item.price} ({item.quantity}).</li>
                                    ))}
                                </ol>
                                <p className='text-pink-800 font-bold text-xl md:text-2xl text-center border-4 p-5 border-pink-800 rounded-2xl flex justify-center items-center'>Thank You, For Ordering</p>
                            </div>
                            <p><span className='text-lg font-semibold'>Total Amount</span> :- Rs. {order.totalAmount}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default OrderReceipt;
