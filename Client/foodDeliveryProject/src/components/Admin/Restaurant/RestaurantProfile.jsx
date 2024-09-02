import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

function RestaurantProfile() {
    const { restaurant, setRestaurant, url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [r, setR] = useState(null);

    useEffect(() => {
        setR(restaurant);
    }, [restaurant]);

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get("username"),
            password: formData.get("password"),
            r: r
        }
        axios.post(`${url}/admin/restaurant/${restaurant._id}/updateDetails`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRestaurant(response.data);
                setError(true)
                setErrorMessage("Successfully updated details..!!")
                setErrorType("success")
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
        e.target.reset();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setR(prevRestaurant => ({
            ...prevRestaurant,
            [name]: value
        }));
    };

    const handleClose = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    return (
        <div className='h-full w-full flex justify-center items-center p-4'>
            {error && (
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={error}
                    autoHideDuration={2000}
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
            <div className='w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl'>
                <p className='rounded-tl-full rounded-r-full bg-indigo-950 text-white px-3 py-2 text-xl w-[60%]'>
                    Update Details
                </p>
                {r && (
                    <form onSubmit={handleUpdate} onChange={handleChange} action="POST" className='flex justify-center flex-col py-4 gap-4'>
                        <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
                            <div className='flex flex-col gap-2 w-full md:w-[45%] p-2'>
                                <label htmlFor="username" className='font-bold'>Admin's Username</label>
                                <input type="text" id="username" placeholder='username'
                                    name="username"
                                    className='px-4 py-2 rounded-full shadow-black shadow-md w-full' />
                            </div>
                            <div className='flex flex-col gap-2 w-full md:w-[45%] p-2'>
                                <label htmlFor="password" className='font-bold'>Password</label>
                                <input type="password" id="password" placeholder='password'
                                    name="password"
                                    className='px-4 py-2 rounded-full shadow-black shadow-md w-full' />
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
                            <div className='flex flex-col gap-2 w-full md:w-[45%] p-2'>
                                <label htmlFor="restaurantName" className='font-bold'>Restaurant's Name</label>
                                <input type="text" id="restaurantName" placeholder='restaurant name'
                                    value={r.name}
                                    name="name"
                                    className='px-4 py-2 rounded-full shadow-black shadow-md w-full' />
                            </div>
                            <div className='flex flex-col gap-2 w-full md:w-[45%] p-2'>
                                <label htmlFor="address" className='font-bold'>Address</label>
                                <input type="text" id="address" placeholder='address'
                                    value={r.address}
                                    name="address"
                                    className='px-4 py-2 rounded-full shadow-black shadow-md w-full' />
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
                            <div className='flex flex-col gap-2 w-full md:w-[45%] p-2'>
                                <label htmlFor="deliveryTime" className='font-bold'>Delivery Time</label>
                                <input type="number" id="deliveryTime" placeholder='delivery time'
                                    value={r.deliveryTime}
                                    name="deliveryTime"
                                    className='px-4 py-2 rounded-full shadow-black shadow-md w-full' />
                            </div>
                            <div className='flex flex-col gap-2 w-full md:w-[45%] p-2'>
                                <label htmlFor="salesTax" className='font-bold'>Comission Rate</label>
                                <input type="number" id="salesTax" placeholder='sales tax'
                                    value={r.comissionRate}
                                    name="comissionRate"
                                    className='px-4 py-2 rounded-full shadow-black shadow-md w-full' />
                            </div>
                        </div>
                        <button className='mx-auto w-full md:w-auto px-5 py-2 bg-indigo-950 text-white font-bold rounded-full'>
                            Update
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default RestaurantProfile;
