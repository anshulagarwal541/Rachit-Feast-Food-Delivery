import React, { useContext, useEffect, useState } from 'react'
import { foodDeliveryLogo } from '../../../../public';
import { AuthContext } from '../../../Helpers/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';



function RiderHeader() {
    const navigate = useNavigate();
    const { vendor, setVendor, admin, setAdmin, url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [state, setState] = useState(false);
    const [rider, setRider] = useState(null);

    useEffect(() => {
        const userAccessToken = localStorage.getItem("userAccessToken");
        const adminAccessToken = localStorage.getItem("adminAccessToken");
        const riderAccessToken = localStorage.getItem("riderAccessToken");
        const vendorAccessToken = localStorage.getItem("vendorAccessToken");
        if (userAccessToken || adminAccessToken || riderAccessToken || vendorAccessToken) {
            setIsLoggedIn(true);
        }
        axios.get(`${url}/rider`, {
            headers: {
                riderAccessToken: localStorage.getItem("riderAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRider(response.data);
            }
            else {
                console.log(response.data.error);
            }
        })
    }, [])

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState(open);
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            {

            }
            <List
            >
                {['Order History', 'Current Order', 'Account'].map((text, index) => (
                    <Link key={index} to={text === "Order History" ? "/rider/history/order" : (text === "Current Order" ? "/rider/order/current" : (text === "Account" ? "/rider/accountUpdate" : "/rider"))}>
                        <ListItem disablePadding
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                                padding: "10px"
                            }}
                        >
                            <div className='border cursor-pointer border-1 border-indigo-950 px-5 py-2 w-full flex gap-5'>
                                <ListItemIcon sx={{ color: "#1e1b4b" }}>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <p className='font-bold'>{text}</p>
                            </div>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem
                    disablePadding
                    style={{
                        padding: "10px"
                    }}
                >
                    {isLoggedIn ?
                        (
                            <button onClick={handleLogout} className='font-bold text-indigo-950 border-2 border-indigo-950 px-5 py-2 w-full mx-auto'><Link to="/rider/login">Logout</Link></button>
                        )
                        :
                        (
                            <button className='font-bold text-indigo-950 border-2 border-indigo-950 px-5 py-2 w-full mx-auto'><Link to="/rider/login">Login</Link></button>
                        )}
                </ListItem>
            </List>
        </Box>
    );

    const handleLogout = () => {
        localStorage.removeItem("userAccessToken");
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("riderAccessToken");
        localStorage.removeItem("vendorAccessToken");
        setError(true)
        setErrorType("success")
        setErrorMessage("Successfully logged out ..!! :)")
        navigate("/rider/login")
    }

    return (
        <div className='bg-indigo-950 w-full flex justify-between items-center py-2 px-10'>
            <div className='w-fit'>
                <Link to="/rider/home">
                    <div className='flex gap-2 items-center'>
                        <img src={foodDeliveryLogo} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                        <p className='text-white font-bold text-xl'>Rachit's Feast</p>
                    </div>
                </Link>
            </div>
            {/* {rider && (
                <p className='text-white font-bold text-xl w-fit text-center'>Welcome {rider.username}</p>
            )} */}
            <div className='flex justify-end'>
                <div className='flex gap-4'>
                    <React.Fragment key="right"
                    >
                        <button className='text-white font-bold text-2xl' onClick={toggleDrawer("right", true)}><MenuIcon /></button>
                        <SwipeableDrawer
                            anchor="right"
                            open={state}
                            onClose={toggleDrawer("right", false)}
                            onOpen={toggleDrawer("right", true)}
                            sx={{
                                '& .MuiPaper-root': {
                                    backgroundColor: '#eef2ff',
                                    color: '#1e1b4b'
                                }
                            }}
                        >
                            {list("right")}
                        </SwipeableDrawer>
                    </React.Fragment>
                </div>
            </div>
        </div>
    )
}

export default RiderHeader