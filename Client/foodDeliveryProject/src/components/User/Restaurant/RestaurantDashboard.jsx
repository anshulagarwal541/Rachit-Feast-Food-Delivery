import React, { useContext, useEffect, useState } from 'react';
import UserHeader from '../UserHeader';
import BillDetails from './BillDetails';
import RestaurantSection from './RestaurantSection';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

function RestaurantDashboard() {
    const { url, restaurant, setRestaurant, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const { id } = useParams();
    const [bill, setBill] = useState(null);
    const [pendingOrderRestaurant, setPendingOrderRestaurant] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${url}/home/restaurant/${id}`).then((response) => {
            if (!response.data.error) {
                setRestaurant(response.data);
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });

        axios.get(`${url}/user/getBill`, {
            headers: {
                userAccessToken: localStorage.getItem('userAccessToken'),
            },
        }).then((response) => {
            if (!response.data.error) {
                setBill(response.data.foods);
                setPendingOrderRestaurant(response.data.restaurant);
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
    }, [url, id, setRestaurant]);

    const handleConfirmButton = () => {
        axios.get(`${url}/user/bill/reset`, {
            headers: {
                userAccessToken: localStorage.getItem('userAccessToken'),
            },
        }).then((response) => {
            if (!response.data.error) {
                setBill(response.data.foods);
                setPendingOrderRestaurant(response.data.restaurant);
                setError(true)
                setErrorType("success")
                setErrorMessage("Cart Order deleted..!!")
            } else {
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

    const handleCancelButton = () => {
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{
            url, restaurant, setRestaurant, bill, setBill, id, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType
        }}>
            <div className=' bg-indigo-50 min-h-screen'>
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
                <UserHeader />
                <div className='relative flex flex-col lg:flex-row bg-indigo-50 pb-10'>
                    <div className='relative w-full lg:w-2/3'>
                        <RestaurantSection />
                    </div>
                    <div className='w-full bg-indigo-950 text-white lg:text-black lg:bg-transparent lg:w-1/3'>
                        <BillDetails />
                    </div>
                    {restaurant && pendingOrderRestaurant && restaurant._id !== pendingOrderRestaurant._id && (
                        <div className='absolute z-20 w-full h-full flex justify-center items-center backdrop-blur-sm'>
                            <div className='bg-indigo-50 p-6 md:p-10 rounded-2xl flex flex-col gap-3 md:gap-5 justify-center items-center border border-yellow-500'>
                                <p className='text-center font-bold'>
                                    Are you sure you want to switch this restaurant?
                                    <br />
                                    Your cart order will be erased.
                                </p>
                                <div className='flex gap-3 md:gap-5'>
                                    <button onClick={handleConfirmButton} className='bg-indigo-950 text-white font-bold px-4 py-2 md:px-5 md:py-3 rounded border border-yellow-500'>
                                        Confirm
                                    </button>
                                    <button onClick={handleCancelButton} className='bg-indigo-950 text-white font-bold px-4 py-2 md:px-5 md:py-3 rounded border border-yellow-500'>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export default RestaurantDashboard;
