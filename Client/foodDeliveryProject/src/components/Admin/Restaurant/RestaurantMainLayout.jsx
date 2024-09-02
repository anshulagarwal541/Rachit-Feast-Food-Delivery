import React, { useContext } from 'react'
import RestaurantDashboard from './RestaurantDashboard'
import { Outlet } from 'react-router-dom'
import { AuthContext } from '../../../Helpers/AuthContext'

function RestaurantMainLayout() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    return (
        <AuthContext.Provider value={{ url, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType }}>
            <RestaurantDashboard>
                <Outlet />
            </RestaurantDashboard>
        </AuthContext.Provider>
    )
}

export default RestaurantMainLayout