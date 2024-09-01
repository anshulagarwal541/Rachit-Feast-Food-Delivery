// import React, { useContext, useEffect, useState } from 'react';
// import GradeIcon from '@mui/icons-material/Grade';
// import MenuSection from './MenuSection';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import { AuthContext } from '../../../Helpers/AuthContext';
// import { pizza, HomePic1 } from '../../../../public'
// import axios from 'axios';
// import Carousel from 'react-material-ui-carousel';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween'; // Import the isBetween plugin

// dayjs.extend(isBetween); // Extend dayjs with the isBetween plugin

// function RestaurantSection() {
//     const { restaurant, setRestaurant, bill, setBill, url, id } = useContext(AuthContext);
//     const [category, setCategory] = useState("All");
//     const [foodItems, setFoodItems] = useState(null);
//     const [categories, setCategories] = useState(null);
//     const [currentTime, setCurrentTime] = useState('');
//     const [currentDay, setCurrentDay] = useState('');
//     const [isOpen, setIsOpen] = useState(false); // State to track if the restaurant is open
//     const [user, setUser] = useState(null)

//     useEffect(() => {
//         axios.get(`${url}/home/restaurant/${id}`).then((response) => {
//             if (!response.data.error) {
//                 setRestaurant(response.data);
//                 setCategory("All");
//                 setFoodItems(response.data.foods);
//                 setCategories(response.data.categories);
//                 checkRestaurantOpen(response.data.timing);
//             }
//             else {
//                 console.log(response.data.error);
//             }
//         });

//         axios.get(`${url}/user`, {
//             headers: {
//                 userAccessToken: localStorage.getItem("userAccessToken")
//             }
//         }).then((response) => {
//             if (!response.data.error) {
//                 setUser(response.data)
//             }
//             else {
//                 console.log(response.data.error);
//             }
//         })

//         // Get current time and day
//         const getCurrentTimeAndDay = () => {
//             const now = dayjs();
//             const formattedTime = now.format('HH:mm'); // Current time in 12-hour format with AM/PM
//             const formattedDay = now.format('dddd').toUpperCase().slice(0, 3); // Current day of the week
//             setCurrentTime(formattedTime);
//             setCurrentDay(formattedDay);
//         };
//         getCurrentTimeAndDay()

//     }, []);

//     const checkRestaurantOpen = (timing) => {
//         const now = dayjs();
//         const currentDaySchedule = timing.find(t => t.day == now.format('dddd').toUpperCase().slice(0, 3));

//         if (currentDaySchedule) {
//             const { openTime, closeTime, isClosed } = currentDaySchedule;
//             if (isClosed) {
//                 setIsOpen(false);
//             } else {
//                 const todayDate = now.format('YYYY-MM-DD');
//                 const open = dayjs(`${todayDate} ${openTime}`, 'YYYY-MM-DD HH:mm');
//                 const close = dayjs(`${todayDate} ${closeTime}`, 'YYYY-MM-DD HH:mm');
//                 setIsOpen(now.isBetween(open, close, null, '[]'));
//             }
//         } else {
//             setIsOpen(false);
//         }
//     };

//     const handleCategory = (c) => {
//         setCategory(c);
//         if (c === "All") {
//             setCategories(restaurant.categories);
//         }
//         else {
//             setCategories(c);
//         }
//     };

//     const handleFavourite = () => {
//         const data = {
//             restaurantId: restaurant._id
//         }
//         axios.post(`${url}/user/restaurant/addfavourite`, data, {
//             headers: {
//                 userAccessToken: localStorage.getItem("userAccessToken")
//             }
//         }).then((response) => {
//             if (!response.data.error) {
//                 setUser(response.data)
//             }
//             else {
//                 console.log(response.data.error);
//             }
//         })
//     }

//     return (
//         <AuthContext.Provider value={{ bill, setBill, url }}>
//             <div className='flex flex-col gap-5 h-[100vh] bg-indigo-50'>
//                 <div
//                     style={{
//                         backgroundImage: `url(${HomePic1})`
//                     }}
//                     className='relative text-white bg-center bg-cover bg-no-repeat w-full h-[20rem] rounded-b-3xl'
//                 >
//                     <div className='absolute flex justify-center items-center backdrop-brightness-50 brightness-100 text-white w-full h-full rounded-b-3xl'>
//                         <div className='relative w-full h-full flex justify-center items-center'>
//                             <div className='border-4 border-yellow-500 rounded-3xl p-5 flex flex-col items-center gap-3'>
//                                 <p className='font-bold text-3xl'>{restaurant && restaurant.name}</p>
//                                 <div className='font-bold flex justify-center items-center gap-5'>
//                                     <div className='text-yellow-500'>
//                                         <GradeIcon fontSize='large' />
//                                     </div>
//                                     <p className='text-xl'>{restaurant && restaurant.totalRating} / 5</p>
//                                 </div>
//                                 <p className='font-bold text-xl'>Delivery in {restaurant && restaurant.deliveryTime} minutes</p>
//                             </div>
//                             <div className='absolute w-full h-full'>
//                                 <div className='w-full h-fit flex justify-end items-end p-5'>
//                                     <div className='w-fit h-fit text-pink-700 p-1'>
//                                         <div onClick={handleFavourite} className='cursor-pointer w-fit h-fit p-1 bg-white rounded-full'>
//                                             {user && user.wishlist.length > 0 && restaurant && user.wishlist.find((res) => res._id === restaurant._id) ?
//                                                 (
//                                                     <FavoriteIcon />
//                                                 )
//                                                 :
//                                                 (
//                                                     <FavoriteBorderIcon />
//                                                 )
//                                             }
//                                         </div>
//                                     </div>
//                                 </div>

//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {restaurant && (
//                     <div className='w-[95%] mx-auto h-fit'>
//                         <Carousel
//                             interval={2000}
//                             animation={"slide"}
//                             indicators={false}
//                         >
//                             {restaurant.coupons.length > 0 && (
//                                 restaurant.coupons.map((coupon, i) => {
//                                     return (
//                                         <div key={i} className='bg-indigo-950 text-yellow-400 font-extrabold flex justify-center items-center px-5 py-2 w-full'>
//                                             <p>
//                                                 {coupon.title} :- FLAT {coupon.discount}% OFF ON ALL FOODS
//                                             </p>
//                                         </div>
//                                     )
//                                 })
//                             )}
//                         </Carousel>
//                     </div>
//                 )}
//                 {isOpen ? (
//                     <div className='w-[95%] mx-auto bg-white p-5 rounded-2xl flex justify-evenly'>
//                         <button onClick={() => handleCategory("All")} className={`${category == "All" ? "bg-indigo-950 text-white px-5 py-2" : "py-2 px-5 text-indigo-950"} font-bold text-xl`}>All</button>
//                         {restaurant && restaurant.categories.length > 0 && restaurant.categories.map((c, i) => {
//                             return <button onClick={() => handleCategory(c.name)} key={i} className={`${category === c.name ? "bg-indigo-950 text-white px-5 py-2" : "py-2 px-5 text-indigo-950"} font-bold text-xl`}>{c.name}</button>
//                         })}
//                     </div>
//                 ) : (
//                     <div className="text-center text-xl font-bold text-red-500">
//                         Sorry, the restaurant is currently closed.
//                     </div>
//                 )}
//                 {isOpen && (
//                     <div className='bg-indigo-50 flex flex-col gap-5 overflow-y-scroll h-[500px]'>
//                         {categories && category == "All" ?
//                             (
//                                 categories.map((c, i) => {
//                                     return <MenuSection key={i} category={c} restaurant={restaurant} />
//                                 })
//                             )
//                             :
//                             (
//                                 < MenuSection category={categories} restaurant={restaurant} />
//                             )}
//                         {/* {category && category !== "All" && (
//                             < MenuSection category={category} restaurant={restaurant} />
//                         )} */}
//                     </div>
//                 )}
//             </div>
//         </AuthContext.Provider>
//     );
// }

// export default RestaurantSection;



import React, { useContext, useEffect, useState } from 'react';
import GradeIcon from '@mui/icons-material/Grade';
import MenuSection from './MenuSection';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthContext } from '../../../Helpers/AuthContext';
import { pizza, HomePic1 } from '../../../../public';
import axios from 'axios';
import Carousel from 'react-material-ui-carousel';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'; // Import the isBetween plugin

dayjs.extend(isBetween); // Extend dayjs with the isBetween plugin

function RestaurantSection() {
    const { restaurant, setRestaurant, bill, setBill, url, id, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [category, setCategory] = useState("All");
    const [foodItems, setFoodItems] = useState(null);
    const [categories, setCategories] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDay, setCurrentDay] = useState('');
    const [isOpen, setIsOpen] = useState(false); // State to track if the restaurant is open
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${url}/home/restaurant/${id}`).then((response) => {
            if (!response.data.error) {
                setRestaurant(response.data);
                setCategory("All");
                setFoodItems(response.data.foods);
                setCategories(response.data.categories);
                checkRestaurantOpen(response.data.timing);
            } else {
                console.log(response.data.error);
            }
        });

        axios.get(`${url}/user`, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setUser(response.data);
            } else {
                console.log(response.data.error);
            }
        });

        // Get current time and day
        const getCurrentTimeAndDay = () => {
            const now = dayjs();
            const formattedTime = now.format('HH:mm'); // Current time in 12-hour format with AM/PM
            const formattedDay = now.format('dddd').toUpperCase().slice(0, 3); // Current day of the week
            setCurrentTime(formattedTime);
            setCurrentDay(formattedDay);
        };
        getCurrentTimeAndDay();

    }, [url, id, setRestaurant]);

    const checkRestaurantOpen = (timing) => {
        const now = dayjs();
        const currentDaySchedule = timing.find(t => t.day === now.format('dddd').toUpperCase().slice(0, 3));

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
            setIsOpen(false);
        }
    };

    const handleCategory = (c) => {
        setCategory(c);
        if (c === "All") {
            setCategories(restaurant.categories);
        } else {
            setCategories(c);
        }
    };

    const handleFavourite = () => {
        const data = {
            restaurantId: restaurant._id
        };
        axios.post(`${url}/user/restaurant/addfavourite`, data, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("info")
                setErrorMessage("Your wishlist has been updated..!! :)")
                setUser(response.data);
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
    };

    return (
        <AuthContext.Provider value={{ bill, setBill, url, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType }}>
            <div className='flex flex-col gap-5 h-full bg-indigo-50'>
                <div
                    style={{
                        backgroundImage: `url(${HomePic1})`
                    }}
                    className='relative text-white bg-center bg-cover bg-no-repeat w-full h-[20rem] rounded-b-3xl'
                >
                    <div className='absolute inset-0 flex justify-center items-center backdrop-brightness-50 brightness-100 rounded-b-3xl'>
                        <div className='relative w-full h-full flex justify-center items-center'>
                            <div className='border-4 border-yellow-500 rounded-3xl p-5 flex flex-col items-center gap-3'>
                                <p className='font-bold text-3xl'>{restaurant && restaurant.name}</p>
                                <div className='font-bold flex justify-center items-center gap-5'>
                                    <div className='text-yellow-500'>
                                        <GradeIcon fontSize='large' />
                                    </div>
                                    <p className='text-xl'>{restaurant && restaurant.totalRating} / 5</p>
                                </div>
                                <p className='font-bold text-xl'>Delivery in {restaurant && restaurant.deliveryTime} minutes</p>
                            </div>
                            <div className='absolute inset-0 flex justify-end items-start p-5'>
                                <div className='text-pink-700 p-1'>
                                    <div onClick={handleFavourite} className='cursor-pointer p-1 bg-white rounded-full'>
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
                        </div>
                    </div>
                </div>
                {restaurant && (
                    <div className='relative w-[95%] mx-auto h-fit'>
                        <Carousel
                            interval={2000}
                            animation={"slide"}
                            indicators={false}
                        >
                            {restaurant.coupons.length > 0 && (
                                restaurant.coupons.map((coupon, i) => {
                                    return (
                                        <div key={i} className='bg-indigo-950 text-yellow-400 font-extrabold flex justify-center items-center px-5 py-2 w-full'>
                                            <p className='text-center'>
                                                {coupon.title} :- FLAT {coupon.discount}% OFF ON ALL FOODS
                                            </p>
                                        </div>
                                    )
                                })
                            )}
                        </Carousel>
                    </div>
                )}
                {isOpen ? (
                    <div className='w-[95%] mx-auto bg-white p-5 rounded-2xl flex flex-wrap justify-evenly'>
                        <button onClick={() => handleCategory("All")} className={`${category === "All" ? "bg-indigo-950 text-white px-5 py-2" : "py-2 px-5 text-indigo-950"} font-bold text-xl`}>All</button>
                        {restaurant && restaurant.categories.length > 0 && restaurant.categories.map((c, i) => {
                            return <button onClick={() => handleCategory(c.name)} key={i} className={`${category === c.name ? "bg-indigo-950 text-white px-5 py-2" : "py-2 px-5 text-indigo-950"} font-bold text-xl`}>{c.name}</button>
                        })}
                    </div>
                ) : (
                    <div className="text-center text-xl font-bold text-red-500">
                        Sorry, the restaurant is currently closed.
                    </div>
                )}
                {isOpen && (
                    <div className='bg-indigo-50 flex flex-col gap-5 overflow-y-auto h-[500px]'>
                        {categories && category === "All" ?
                            (
                                categories.map((c, i) => {
                                    return <MenuSection key={i} category={c} restaurant={restaurant} />
                                })
                            )
                            :
                            (
                                <MenuSection category={categories} restaurant={restaurant} />
                            )}
                    </div>
                )}
            </div>
        </AuthContext.Provider>
    );
}

export default RestaurantSection;
