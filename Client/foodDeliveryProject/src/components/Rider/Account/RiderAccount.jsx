import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Helpers/AuthContext';
import { foodDeliveryLogo } from '../../../../public';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';

function RiderAccount() {
    const navigate = useNavigate();
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [riderUpdate, setRiderUpdate] = useState(null);

    useEffect(() => {
        axios.get(`${url}/rider`, {
            headers: {
                riderAccessToken: localStorage.getItem("riderAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRiderUpdate(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    }, [url]);

    const handleSubmit = () => {
        const data = riderUpdate;
        axios.post(`${url}/rider/accountUpdate`, data, {
            headers: {
                riderAccessToken: localStorage.getItem("riderAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage(response.data)
                navigate("/rider/home");
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

    return (
        <div className='h-screen bg-indigo-50 flex justify-center items-center p-4'>
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
            <div className='bg-indigo-950 text-white w-full max-w-md h-auto shadow-2xl p-5 flex flex-col justify-center rounded-3xl'>
                <form action="POST" className='w-full flex flex-col'>
                    <div className='flex flex-col sm:flex-row sm:justify-between items-center mb-6'>
                        <img src={foodDeliveryLogo} alt="food-delivery-logo" className='w-16 sm:w-20 rounded-full mb-4 sm:mb-0' />
                        <p className='font-bold text-2xl sm:text-3xl text-indigo-50'>Account Update</p>
                    </div>
                    {riderUpdate && (
                        <div className='p-5 flex flex-col gap-5'>
                            <div className='flex flex-col gap-2 w-full'>
                                <label htmlFor="name" className='font-bold text-lg sm:text-xl'>Name:</label>
                                <input
                                    type="text"
                                    value={riderUpdate.name}
                                    id="name"
                                    onChange={(e) => setRiderUpdate(prev => ({ ...prev, name: e.target.value }))}
                                    name="name"
                                    placeholder='Eg. Mark Asurn'
                                    className='w-full px-4 py-3 rounded-full bg-indigo-50 text-black'
                                />
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label htmlFor="phone" className='font-bold text-lg sm:text-xl'>Mobile No:</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={riderUpdate.phone}
                                    onChange={(e) => setRiderUpdate(prev => ({ ...prev, phone: e.target.value }))}
                                    name="phone"
                                    placeholder='Eg. Valid Phone'
                                    className='w-full px-4 py-3 rounded-full bg-indigo-50 text-black'
                                />
                            </div>
                        </div>
                    )}
                </form>
                <div className='flex flex-col gap-4 mt-6'>
                    <button onClick={handleSubmit} className='bg-indigo-50 text-indigo-950 font-bold text-lg sm:text-xl px-4 py-2 rounded-2xl'>Update</button>
                    <button className='bg-indigo-50 text-indigo-950 font-bold text-lg sm:text-xl px-4 py-2 rounded-2xl'><Link to="/rider/home">Back</Link></button>
                </div>
            </div>
        </div>
    );
}

export default RiderAccount;
