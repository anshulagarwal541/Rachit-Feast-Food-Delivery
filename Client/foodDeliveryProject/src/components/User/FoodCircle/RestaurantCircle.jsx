// import axios from 'axios';
// import React, { useContext, useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom';
// import { AuthContext } from '../../../Helpers/AuthContext';
// import { Link } from 'react-router-dom';
// import RestaurantCard from '../HomePage/RestaurantCard';
// import UserHeader from '../UserHeader';

// function RestaurantCircle() {
//     const { url } = useContext(AuthContext);
//     const { food } = useParams();
//     const [currentFood, setCurrentFood] = useState(null);
//     const [allRestaurants, setAllRestaurants] = useState(null);
//     useEffect(() => {
//         setCurrentFood(food)
//     }, [])

//     useEffect(() => {
//         axios.post(`${url}/user/food/restaurant`, {
//             food: currentFood
//         }).then((response) => {
//             if (!response.data.error) {
//                 setAllRestaurants(response.data);
//             }
//             else {
//                 console.log(response.data.error);
//             }
//         })
//     }, [currentFood])

//     return (
//         <div className='bg-indigo-950 h-[100vh] text-white'>
//             <UserHeader />
//             <div className='w-[90%] mx-auto py-5 flex flex-col justify-center items-center gap-10'>
//                 <p className='text-4xl font-bold'>Showing Restaurants near you...</p>
//                 <div className='w-full flex justify-center'>
//                     <input
//                         type="text"
//                         placeholder='Find here what you need'
//                         className='text-black border-none rounded-full w-[85%] py-5 px-3'
//                         value={currentFood}
//                         onChange={(e) => setCurrentFood(e.target.value)}
//                     />
//                 </div>
//                 <div className='flex flex-wrap gap-10 justify-center items-start w-full'>
//                     {allRestaurants && allRestaurants.length > 0 ?
//                         (
//                             allRestaurants.map((restaurant, i) => {
//                                 return (

//                                     <Link key={i} to={`/home/restaurant/${restaurant._id}`}>
//                                         <RestaurantCard restaurant={restaurant} />
//                                     </Link>
//                                 )
//                             })
//                         )
//                         :
//                         (
//                             <div className='bg-white w-[80%] mx-auto px-5 py-3 rounded-2xl flex justify-center items-center'>
//                                 <p className='text-indigo-950 font-bold text-3xl'>
//                                     No Restaurants Found.. Please refresh the page..!!!
//                                 </p>
//                             </div>
//                         )
//                     }
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default RestaurantCircle


import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../Helpers/AuthContext';
import { Link } from 'react-router-dom';
import RestaurantCard from '../HomePage/RestaurantCard';
import UserHeader from '../UserHeader';

function RestaurantCircle() {
    const { url } = useContext(AuthContext);
    const { food } = useParams();
    const [currentFood, setCurrentFood] = useState(food || '');
    const [allRestaurants, setAllRestaurants] = useState(null);

    useEffect(() => {
        if (currentFood) {
            axios.post(`${url}/user/food/restaurant`, { food: currentFood })
                .then((response) => {
                    if (!response.data.error) {
                        setAllRestaurants(response.data);
                    } else {
                        console.log(response.data.error);
                    }
                });
        }
    }, [currentFood, url]);

    return (
        <div className="bg-indigo-950 min-h-screen text-white">
            <UserHeader />
            <div className="w-full max-w-5xl mx-auto py-5 flex flex-col justify-center items-center gap-10 px-4">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
                    Showing Restaurants near you...
                </p>
                <div className="w-full flex justify-center">
                    <input
                        type="text"
                        placeholder="Find here what you need"
                        className="text-black border-none rounded-full w-full max-w-md py-3 px-4"
                        value={currentFood}
                        onChange={(e) => setCurrentFood(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-5 justify-center items-start w-full">
                    {allRestaurants && allRestaurants.length > 0 ? (
                        allRestaurants.map((restaurant, i) => (
                            <Link key={i} to={`/home/restaurant/${restaurant._id}`}>
                                <RestaurantCard restaurant={restaurant} />
                            </Link>
                        ))
                    ) : (
                        <div className="bg-white w-full max-w-xl mx-auto px-5 py-3 rounded-2xl flex justify-center items-center">
                            <p className="text-indigo-950 font-bold text-lg sm:text-xl md:text-3xl text-center">
                                No Restaurants Found.. Please refresh the page..!!!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RestaurantCircle;
