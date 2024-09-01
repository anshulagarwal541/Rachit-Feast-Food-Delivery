import React, { useState, useEffect, useContext } from 'react';
import RiderGraph from '../../components/Admin/Riders/RiderGraph';
import RiderFilter from '../../components/Admin/Riders/RiderFilter';
import { AuthContext } from '../../Helpers/AuthContext';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

function Riders() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [riders, setRiders] = useState([]);

    useEffect(() => {
        axios.get(`${url}/admin/allRiders`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken"),
            },
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetRider(response.data);
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
    }, [url]);

    const transformAndSetRider = (rider) => {
        const transformedRider = rider.map((res) => ({
            id: res._id,
            name: res.name,
            username: res.username,
            password: res.password,
            phone: res.phone,
            status: res.availability,
        }));
        setRiders(transformedRider);
    };

    const handleClose = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    return (
        <AuthContext.Provider value={{ riders, setRiders, transformAndSetRider, url, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType }}>
            <div className='flex flex-col gap-5 justify-center items-center min-h-screen px-4 py-6'>
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
                <RiderFilter />
                <RiderGraph />
            </div>
        </AuthContext.Provider>
    );
}

export default Riders;
