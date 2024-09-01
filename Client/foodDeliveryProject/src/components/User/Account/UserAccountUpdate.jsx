import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Helpers/AuthContext';
import { foodDeliveryLogo } from '../../../../public';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';

function UserAccountUpdate() {
    const navigate = useNavigate();
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [userUpdate, setUserUpdate] = useState(null);

    useEffect(() => {
        axios.get(`${url}/user`, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken"),
            },
        }).then((response) => {
            if (!response.data.error) {
                setUserUpdate(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = userUpdate;
        axios.post(`${url}/user/accountUpdate`, data, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken"),
            },
        }).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage("Successfully Updated your account..!! :)")
                navigate("/");
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
        <div className="min-h-screen bg-indigo-50 flex justify-center items-center p-4">
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
            <form className="bg-indigo-950 text-white w-full max-w-lg h-auto shadow-2xl p-5 pt-10 flex flex-col justify-center rounded-3xl">
                <div className="flex justify-between px-5 items-center mb-5">
                    <img src={foodDeliveryLogo} alt="food-delivery-logo" className="w-16 h-16 rounded-full" />
                    <p className="font-bold text-indigo-50 text-xl sm:text-2xl md:text-3xl">Account Update</p>
                </div>
                {userUpdate && (
                    <div className="p-5 flex flex-col gap-5 justify-center">
                        <div className="flex flex-col gap-2 w-full px-5">
                            <label htmlFor="name" className="font-bold text-lg sm:text-xl">Name:</label>
                            <input
                                type="text"
                                value={userUpdate.name}
                                id="name"
                                onChange={(e) => setUserUpdate(prev => ({ ...prev, name: e.target.value }))}
                                name="name"
                                placeholder="Eg. Mark Asurn"
                                className="w-full px-4 py-3 rounded-full bg-indigo-50 text-black"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full px-5">
                            <label htmlFor="email" className="font-bold text-lg sm:text-xl">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={userUpdate.email}
                                onChange={(e) => setUserUpdate(prev => ({ ...prev, email: e.target.value }))}
                                name="email"
                                placeholder="Eg. ...@example.com"
                                className="w-full px-4 py-3 rounded-full bg-indigo-50 text-black"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full px-5">
                            <label htmlFor="phone" className="font-bold text-lg sm:text-xl">Mobile No:</label>
                            <input
                                type="number"
                                id="phone"
                                value={userUpdate.phone}
                                onChange={(e) => setUserUpdate(prev => ({ ...prev, phone: e.target.value }))}
                                name="phone"
                                placeholder="Eg. Valid Phone"
                                className="w-full px-4 py-3 rounded-full bg-indigo-50 text-black"
                            />
                        </div>
                        <div className="py-5 flex flex-col gap-3">
                            <button onClick={handleSubmit} className="bg-indigo-50 text-indigo-950 font-bold text-lg sm:text-xl px-4 py-2 rounded-2xl">Update</button>
                            <button className="bg-indigo-50 text-indigo-950 font-bold text-lg sm:text-xl px-4 py-2 rounded-2xl">
                                <Link to="/">Back</Link>
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default UserAccountUpdate;
