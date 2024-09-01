import React, { useContext } from 'react'
import { home, management, general } from './index.js';
import { MenuItem } from '@mui/material';
import { AuthContext } from '../../../Helpers/AuthContext.js';
import { Link } from 'react-router-dom';

function DeviceHeader() {
    const { handleGeneralClick, handleManagementClick } = useContext(AuthContext);
    return (
        <>
            <MenuItem><Link to="/admin">Home</Link></MenuItem>
            <MenuItem onClick={handleGeneralClick}>General</MenuItem>
            <MenuItem onClick={handleManagementClick}>Management</MenuItem>
        </>
    )
}

export default DeviceHeader