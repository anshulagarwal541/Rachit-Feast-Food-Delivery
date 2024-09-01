import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Helpers/AuthContext';
import UserHeader from '../UserHeader';
import RestaurantCard from '../HomePage/RestaurantCard';

function UserWishlist() {
    const { url } = useContext(AuthContext);
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${url}/user`, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken"),
            },
        })
            .then((response) => {
                if (!response.data.error) {
                    setUser(response.data);
                } else {
                    console.log(response.data.error);
                }
            });
    }, []);

    return (
        <div className="bg-indigo-950 h-lvh">
            <UserHeader />
            <div className="py-10 w-full">
                <p className="font-bold text-3xl md:text-4xl text-indigo-50 text-center mb-6">Wishlists</p>
                <div className="flex w-full justify-center items-center flex-wrap gap-5 px-5">
                    {user && user.wishlist && user.wishlist.length > 0 ? (
                        user.wishlist.map((res, i) => (
                            <Link to={`/home/restaurant/${res._id}`} key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                                <RestaurantCard restaurant={res} />
                            </Link>
                        ))
                    ) : (
                        <div className="font-bold text-indigo-50 w-full text-xl md:text-2xl text-center py-10">
                            No wishlist found..
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserWishlist;
