import React, { useContext } from 'react'
import { home, management } from './index.js';
import { MenuItem } from '@mui/material';
import { AuthContext } from '../../../Helpers/AuthContext.js';
import { Link } from 'react-router-dom';

function RestaurantDeviceHeader() {
    const { handleGeneralClick, handleManagementClick } = useContext(AuthContext);
    return (
        <>
            <MenuItem onClick={handleGeneralClick}>Home</MenuItem>
            <MenuItem onClick={handleManagementClick}>Management</MenuItem>
        </>
    )
}

export default RestaurantDeviceHeader