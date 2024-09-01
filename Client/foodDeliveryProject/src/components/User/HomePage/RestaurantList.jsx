import React, { useContext, useEffect, useState } from 'react';
import RestaurantCard from './RestaurantCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../Helpers/AuthContext';

function RestaurantList() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [allRestaurants, setAllRestaurants] = useState(null);

    useEffect(() => {
        axios.get(`${url}/home/allRestaurants`).then((response) => {
            if (!response.data.error) {
                setAllRestaurants(response.data);
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
    }, [url]); // Add `url` as a dependency to ensure the effect runs correctly

    return (
        <AuthContext.Provider value={{ url, setAllRestaurants, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType }}>
            <div className='bg-indigo-950 min-h-screen text-white'>
                <div className='w-[90%] mx-auto py-5 flex flex-col justify-center items-center gap-6 md:gap-10'>
                    <p className='text-2xl md:text-3xl lg:text-4xl font-bold text-center'>
                        Showing Restaurants near you...
                    </p>
                    <div className='w-full flex justify-center'>
                        <input
                            type='text'
                            placeholder='Find here what you need'
                            className='text-black border-none rounded-full w-full max-w-md py-3 md:py-5 px-3'
                        />
                    </div>
                    <div className='flex flex-wrap gap-6 md:gap-10 justify-center items-start w-full'>
                        {allRestaurants && allRestaurants.length > 0 ? (
                            allRestaurants.map((restaurant, i) => (
                                <Link key={i} to={`/home/restaurant/${restaurant._id}`}>
                                    <RestaurantCard restaurant={restaurant} />
                                </Link>
                            ))
                        ) : (
                            <div className='bg-white w-full max-w-md mx-auto px-5 py-3 rounded-2xl flex justify-center items-center'>
                                <p className='text-indigo-950 font-bold text-xl md:text-2xl lg:text-3xl text-center'>
                                    No Restaurants Found.. Please refresh the page..!!!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export default RestaurantList;
