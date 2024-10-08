import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Helpers/AuthContext';
import { Alert, Snackbar } from '@mui/material';

function ComissionRates() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState([]);
    const [rate, setRate] = useState(null);

    useEffect(() => {
        axios.get(`${url}/admin/allRestaurants`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRestaurants(response.data);
            }
            else {
                console.log(response.data.error);
            }
        });
    }, []);

    const handleRateChange = (e, index) => {
        const newRate = e.target.value;
        setRestaurants(prevRestaurants =>
            prevRestaurants.map((restaurant, i) =>
                i === index ? { ...restaurant, comissionRate: newRate } : restaurant
            )
        );
    };

    const handleSubmit = (e, index) => {
        e.preventDefault();
        const data = {
            rate: restaurants[index].comissionRate,
            id: restaurants[index]._id
        };
        axios.post(`${url}/admin/restaurant/updateComissionRate`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRestaurants(response.data);
                setError(true)
                setErrorType("success")
                setErrorMessage("Sucessfully updated the commission rate..!!")
            }
            else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
    };

    const handleClose = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    return (
        <div className='flex justify-center py-10 px-4'>
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
            <div className='w-full max-w-3xl bg-white rounded-2xl shadow-md'>
                <p className='bg-indigo-950 text-white px-3 py-2 text-xl rounded-r-full rounded-tl-2xl w-fit md:w-1/2 lg:w-1/3'>
                    Comission Rates
                </p>
                <div className='flex flex-col gap-4 py-4'>
                    {restaurants.length > 0 ? (
                        restaurants.map((restaurant, i) => {
                            return (
                                <div key={i} className='w-[90%] mx-auto'>
                                    <form
                                        onSubmit={(e) => handleSubmit(e, i)}
                                        action="POST"
                                        className='flex flex-col md:flex-row w-full justify-between items-center gap-3'
                                    >
                                        <label htmlFor="comissionRate" className='w-full md:w-1/3'>
                                            {restaurant.name}
                                        </label>
                                        <input
                                            onChange={(e) => handleRateChange(e, i)}
                                            type="number"
                                            value={restaurant.comissionRate}
                                            name="comissionRate"
                                            className='border border-1 rounded-2xl px-5 py-2 w-full md:w-1/3'
                                            required
                                        />
                                        <button className='bg-indigo-950 font-bold text-white px-5 py-2 rounded-xl w-full md:w-1/4'>
                                            Save
                                        </button>
                                    </form>
                                </div>
                            );
                        })
                    ) : (
                        <div className='text-indigo-950 font-bold text-xl text-center'>
                            No Restaurants found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ComissionRates;
