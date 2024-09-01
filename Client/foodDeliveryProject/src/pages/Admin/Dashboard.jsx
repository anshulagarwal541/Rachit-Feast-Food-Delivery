import React, { useContext, useState } from 'react'
import SideBar from '../../components/Admin/Dashboard.jsx/SideBar'
import Header from '../../components/Admin/Dashboard.jsx/Header'
import { AuthContext } from '../../Helpers/AuthContext'
import { Alert, Snackbar } from '@mui/material';
function Dashboard({ children }) {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);

    const handleClose = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    return (
        <AuthContext.Provider value={{
            url, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType
        }}>
            <div className='flex'>
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
                <div className='hidden lg:block md:w-[17%] h-[100vh] bg-indigo-950'>
                    <SideBar />
                </div>
                <div className='w-full lg:w-[83%] h-[100vh] bg-indigo-50 overflow-y-scroll'>
                    <Header />
                    {children}
                </div>
            </div>
        </AuthContext.Provider>
    )
}

export default Dashboard