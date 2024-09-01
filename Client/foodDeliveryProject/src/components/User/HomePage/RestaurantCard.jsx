import React, { useContext, useEffect, useState } from 'react'
import { pizza } from '../../../../public'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'; // Import the isBetween plugin
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
dayjs.extend(isBetween); // Extend dayjs with the isBetween plugin

function RestaurantCard({ restaurant }) {
    const { url, setAllRestaurants } = useContext(AuthContext)
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null)

    useEffect(() => {
        const now = dayjs();
        const currentDaySchedule = restaurant.timing.find(t => t.day == now.format('dddd').toUpperCase().slice(0, 3));

        if (currentDaySchedule) {
            const { openTime, closeTime, isClosed } = currentDaySchedule;
            if (isClosed) {
                setIsOpen(false);
            } else {
                const todayDate = now.format('YYYY-MM-DD');
                const open = dayjs(`${todayDate} ${openTime}`, 'YYYY-MM-DD HH:mm');
                const close = dayjs(`${todayDate} ${closeTime}`, 'YYYY-MM-DD HH:mm');
                setIsOpen(now.isBetween(open, close, null, '[]'));
            }
        } else {
            setIsOpen(false); // If no schedule found, assume closed
        }

        axios.get(`${url}/user`, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setUser(response.data)
            }
            else {
                console.log(response.data.error)
            }
        })

    }, [])

    return (
        <div className='w-[15rem] flex flex-col gap-3 h-fit rounded-2xl bg-white border-4 border-yellow-500 text-black p-2'>
            <div
                style={{
                    backgroundImage: `url(${pizza})`
                }}
                className='relative w-full h-[10rem] rounded-2xl bg-center bg-cover bg-no-repeat'
            >
                <div className='absolute w-full p-2 flex justify-between items-center flex-col h-full'>
                    <div className='w-full h-fit flex justify-between items-center'>
                        <div className='w-fit h-fit bg-green-800 text-white p-1'>
                            {restaurant.deliveryTime}<span className='text-xs'>mins</span>
                        </div>
                        <div className='w-fit h-fit text-pink-700 p-1'>
                            <div className='w-fit h-fit p-1 bg-white rounded-full'>
                                {user && user.wishlist.length > 0 && restaurant && user.wishlist.find((res) => res._id === restaurant._id) ?
                                    (
                                        <FavoriteIcon />
                                    )
                                    :
                                    (
                                        <FavoriteBorderIcon />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-fit flex justify-between items-center'>
                        {isOpen ?
                            (
                                <div className='w-fit h-fit bg-green-800 text-white p-1 rounded font-bold'>
                                    Open
                                </div>
                            )
                            :
                            (
                                <div className='w-fit h-fit bg-red-700 text-white p-1 rounded font-bold'>
                                    Closed
                                </div>
                            )
                        }
                    </div>
                </div>

            </div>
            <div className='flex flex-col justify-center items-center'>
                <p className='font-extrabold text-lg text-indigo-950'>{restaurant.name}</p>
                <p className='bg-green-900 px-5 py-2 text-white font-bold rounded-xl'>{restaurant.totalRating}.0 / 5.0</p>
                <p className='text-xs font-bold text-center'>{restaurant.address}</p>
            </div>
        </div>
    )
}

export default RestaurantCard