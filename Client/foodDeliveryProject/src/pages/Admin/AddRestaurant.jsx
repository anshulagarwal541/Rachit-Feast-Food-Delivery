import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/Admin/Dashboard.jsx/Header';
import { useParams } from 'react-router-dom';
import RestaurantCard from '../../components/Admin/AddRestaurant/RestaurantCard';
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';
import { Alert, Snackbar } from '@mui/material';

function AddRestaurant() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const { id } = useParams();
    const [isClicked, setIsClicked] = useState(false);
    const [restaurants, setRestaurants] = useState(null);

    useEffect(() => {
        axios.get(`${url}/vendor/${id}/getRestaurant`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
            } else {
                setRestaurants(response.data);
            }
        });
    }, []);

    const handleAddNewRestaurant = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            adminId: formData.get("adminId"),
            adminPin: formData.get("adminPin"),
            name: formData.get('name'),
            address: formData.get('address'),
            vendorId: id,
            deliveryCircle: formData.get("deliveryCircle")
        };
        axios.post(`${url}/admin/vendor/addRestaurant`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (response.data.error) {
                setError(true)
                setErrorType("warning")
                setErrorMessage(response.data.error);
            } else {
                setError(true)
                setErrorType("info")
                setErrorMessage("Successfully added a restaurant .. :)")
                setRestaurants(response.data);
            }
        });
        e.target.reset();
    };

    const handleClose = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    return (
        <div className='relative flex justify-center items-center'>
            {error && (
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={error}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    key={"top" + "center"}
                >
                    <Alert
                        onClose={handleClose}
                        severity={errorType}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
            <div className={`${isClicked ? "blur-3xl" : ""} h-full min-h-lvh w-full relative bg-indigo-50 flex flex-col gap-5`}>
                <Header />
                <div className='w-full max-w-[90%] h-full overflow-y-scroll mx-auto flex gap-5 flex-wrap'>
                    {restaurants && restaurants.length > 0 ? (
                        restaurants.map((restaurant, i) => (
                            <RestaurantCard key={i} restaurant={restaurant} />
                        ))
                    ) : (
                        <p className='text-indigo-950 font-bold text-3xl text-center w-full'>No restaurants found for this vendor..</p>
                    )}
                </div>
                <div className='flex justify-center items-center py-5'>
                    <button onClick={() => setIsClicked(true)} className='bg-indigo-950 text-white font-bold px-5 py-2 rounded-full'>
                        Add New Restaurant
                    </button>
                </div>
            </div>
            {isClicked && (
                <div className='absolute w-full min-h-lvh p-10 flex justify-center items-center'>
                    <div className='w-full max-w-[90%] md:max-w-[70rem] h-fit bg-white rounded-2xl shadow-md p-4'>
                        <p className='bg-indigo-950 text-white px-3 py-2 text-xl rounded-r-full'>
                            Graph Filter
                        </p>
                        <form onSubmit={handleAddNewRestaurant} action="POST" className='flex flex-col gap-4 py-4'>
                            <div className='flex flex-wrap gap-4 justify-center'>
                                <div className='flex flex-col gap-3 w-full md:w-[45%] p-2'>
                                    <label htmlFor="username" className='font-bold'>Admin Id</label>
                                    <input name="adminId" type="text" id="username" placeholder='admin id'
                                        className='px-5 py-2 rounded-full shadow-md w-full' />
                                </div>
                                <div className='flex flex-col gap-3 w-full md:w-[45%] p-2'>
                                    <label htmlFor="password" className='font-bold'>Admin Pin</label>
                                    <input name="adminPin" type="password" id="password" placeholder='admin pin'
                                        className='px-5 py-2 rounded-full shadow-md w-full' />
                                </div>
                            </div>
                            <div className='flex flex-wrap gap-4 justify-center'>
                                <div className='flex flex-col gap-3 w-full md:w-[45%] p-2'>
                                    <label htmlFor="restaurantName" className='font-bold'>Restaurant Name</label>
                                    <input name="name" type="text" id="restaurantName" placeholder='restaurant name'
                                        className='px-5 py-2 rounded-full shadow-md w-full' />
                                </div>
                                <div className='flex flex-col gap-3 w-full md:w-[45%] p-2'>
                                    <label htmlFor="address" className='font-bold'>Address</label>
                                    <input name="address" type="text" id="address" placeholder='address'
                                        className='px-5 py-2 rounded-full shadow-md w-full' />
                                </div>
                            </div>
                            <div className='flex flex-wrap gap-4 justify-center'>
                                <div className='flex flex-col gap-3 w-full md:w-[45%] p-2'>
                                    <label htmlFor="deliveryTime" className='font-bold'>Delivery Time</label>
                                    <input name="deliveryTime" type="number" id="deliveryTime" placeholder='delivery time'
                                        className='px-5 py-2 rounded-full shadow-md w-full' />
                                </div>
                                <div className='flex flex-col gap-3 w-full md:w-[45%] p-2'>
                                    <label htmlFor="salesTax" className='font-bold'>Delivery Radius (km)</label>
                                    <input name="deliveryCircle" type="number" id="salesTax" placeholder='delivery radius in km'
                                        className='px-5 py-2 rounded-full shadow-md w-full' />
                                </div>
                            </div>
                            <div className='flex justify-center gap-4'>
                                <button type="submit" className='w-fit px-5 py-2 bg-indigo-950 text-white font-bold rounded-full'>
                                    Save
                                </button>
                                <button onClick={() => setIsClicked(false)} className='w-fit px-5 py-2 bg-indigo-950 text-white font-bold rounded-full'>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddRestaurant;
