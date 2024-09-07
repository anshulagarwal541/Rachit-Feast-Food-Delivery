import React, { useContext, useEffect, useState } from 'react'
import { foodDeliveryLogo } from '../../../public'
import { AuthContext } from '../../Helpers/AuthContext'
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



function UserHeader() {
    const navigate = useNavigate();
    const { vendor, setVendor, admin, setAdmin, rider, setRider, url, setErrorType, setError,
        errorMessage } = useContext(AuthContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [state, setState] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userAccessToken = localStorage.getItem("userAccessToken");
        const adminAccessToken = localStorage.getItem("adminAccessToken");
        const riderAccessToken = localStorage.getItem("riderAccessToken");
        const vendorAccessToken = localStorage.getItem("vendorAccessToken");
        if (userAccessToken || adminAccessToken || riderAccessToken || vendorAccessToken) {
            setIsLoggedIn(true);
        }
        axios.get(`${url}/user`, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setUser(response.data);
            }
            else {
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
            // sx={{
            //     display:"flex",
            //     flexDirection:"column",
            //     gap:"10px"
            // }}
            >
                {['Orders', 'Wishlist', 'Account', 'Current Order'].map((text, index) => (
                    <Link key={index} to={text === "Orders" ? (user ? `/user/${user._id}/orders` : "/") : (text === "Wishlist" ? (user ? `/user/${user._id}/wishlist` : "/") : (text === "Account" ? (user ? `/user/account` : "/") : (text === "Current Order" ? (user ? `/user/order/complete/track` : "/") : "/")))}>
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
                            <button onClick={handleLogout} className='font-bold text-indigo-950 border-2 border-indigo-950 px-5 py-2 w-full mx-auto'><Link to="/user/login">Logout</Link></button>
                        )
                        :
                        (
                            <button className='font-bold text-indigo-950 border-2 border-indigo-950 px-5 py-2 w-full mx-auto'><Link to="/user/login">Login</Link></button>
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
        navigate("/user/login")
    }

    return (
        <div className='bg-indigo-950 w-full flex justify-evenly py-2'>
            <div className='w-[45%]'>
                <Link to="/">
                    <div className='flex gap-2 items-center'>
                        <img src={foodDeliveryLogo} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                        <p className='text-white font-bold text-xl'>Rachit's Feast</p>
                    </div>
                </Link>
            </div>
            <div className='w-[45%] flex justify-end'>
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

export default UserHeader