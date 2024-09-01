
import React, { useContext } from 'react';
import Dashboard from './Dashboard';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../Helpers/AuthContext';

const MainLayout = () => {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    return (
        <AuthContext.Provider value={{
            url, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType
        }}>
            <Dashboard>
                <Outlet />
            </Dashboard>
        </AuthContext.Provider>
    );
};

export default MainLayout;
