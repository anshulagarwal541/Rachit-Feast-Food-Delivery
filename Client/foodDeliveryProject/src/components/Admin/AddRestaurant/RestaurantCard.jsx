import React from 'react';
import { Avatar } from '@mui/material';

function RestaurantCard({ restaurant }) {
    return (
        <div className='relative rounded-2xl w-full sm:w-[15rem] h-[20rem] flex flex-col justify-between bg-white'>
            <img 
                className='rounded-t-2xl w-full h-[10rem] object-cover brightness-50' 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Restaurant Background" 
            />
            <div className='absolute top-[40%] sm:top-[45%] bg-white p-2 rounded-full left-3'>
                <Avatar 
                    alt="Restaurant Avatar" 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                />
            </div>
            <div className='h-[10rem] bg-indigo-950 text-white border-t-2 border-t-white flex flex-col items-center justify-center gap-2 p-4'>
                <p className='font-bold text-lg sm:text-xl'>{restaurant.name}</p>
                <p className='text-center text-sm sm:text-base'>{restaurant.address}</p>
            </div>
        </div>
    );
}

export default RestaurantCard;
