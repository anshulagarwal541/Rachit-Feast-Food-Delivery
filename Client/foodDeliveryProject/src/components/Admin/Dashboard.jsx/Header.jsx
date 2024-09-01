import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../../Helpers/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import DeviceHeader from './DeviceHeader';
import { home, management, general } from './index.js';

function Header() {
    const navigate = useNavigate();
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [admin, setAdmin] = useState(null);
    const [generalAnchorEl, setGeneralAnchorEl] = useState(null);
    const [managementAnchorEl, setManagementAnchorEl] = useState(null);

    // Media query to check screen size for responsive design
    const isMobileOrTablet = useMediaQuery('(max-width: 1024px)');
    const isMobile = useMediaQuery('(max-width: 600px)');

    useEffect(() => {
        axios.get(`${url}/admin`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setAdmin(response.data);
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
                navigate("/admin/login")
            }
        });
    }, [url]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("adminAccessToken");
        setError(true)
        setErrorMessage("Successfully Logged out ..!! :)")
        setErrorType("success")
        navigate("/admin/login");
    };

    const handleGeneralClick = (event) => {
        setGeneralAnchorEl(event.currentTarget);
        setManagementAnchorEl(null); // Close the management submenu if it was open
    };

    const handleManagementClick = (event) => {
        setManagementAnchorEl(event.currentTarget);
        setGeneralAnchorEl(null); // Close the general submenu if it was open
    };

    const handleSubmenuClose = () => {
        setGeneralAnchorEl(null);
        setManagementAnchorEl(null);
    };

    return (
        <AuthContext.Provider value={{ handleGeneralClick, handleManagementClick }}>
            <div className={`bg-indigo-950 rounded-bl-3xl rounded-br-3xl text-white px-3 py-5 ${isMobile ? 'h-[7em]' : 'h-[10em]'}`}>
                <div className={`flex justify-between items-center font-bold ${isMobile ? 'text-xl' : 'text-3xl'} w-[90%] mx-auto`}>
                    <p>{admin && admin.name}</p>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <Avatar sx={{ bgcolor: "orange" }}>{admin && admin.name[0].toUpperCase()}</Avatar>
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {isMobileOrTablet && <DeviceHeader />}
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>

                    {/* Submenu for General */}
                    <Menu
                        anchorEl={generalAnchorEl}
                        open={Boolean(generalAnchorEl)}
                        onClose={handleSubmenuClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        sx={{ marginRight: isMobile ? 1 : 5 }}
                    >
                        {general.map((val, i) => (
                            <MenuItem key={i}>
                                <Link to={val.to}>
                                    {val.name}
                                </Link>
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Submenu for Management */}
                    <Menu
                        anchorEl={managementAnchorEl}
                        open={Boolean(managementAnchorEl)}
                        onClose={handleSubmenuClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        sx={{ marginRight: isMobile ? 1 : 5 }}
                    >
                        {management.map((val, i) => (
                            <MenuItem key={i}>
                                <Link to={val.to}>
                                    {val.name}
                                </Link>
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export default Header;
