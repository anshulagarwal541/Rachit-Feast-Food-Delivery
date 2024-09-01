import React, { useContext } from 'react'
import { HomePic1 } from '../../public'
import FoodCircle from './User/FoodCircle'
import RestaurantList from '../components/User/HomePage/RestaurantList'
import UserHeader from '../components/User/UserHeader'
import { AuthContext } from '../Helpers/AuthContext'
import { Alert, Snackbar } from '@mui/material'

function RachitFeast() {
    const { url, vendor, setVendor, user, setUser, admin, setAdmin, rider, setRider, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);

    const handleClose = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    return (
        <AuthContext.Provider
            value={{
                url,
                vendor, setVendor,
                user, setUser,
                admin, setAdmin,
                rider, setRider,
                error, setError,
                errorMessage, setErrorMessage,
                errorType, setErrorType
            }}>
            <div>
                {error && (
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        open={error}
                        autoHideDuration={6000}
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
                <UserHeader />
                <div>
                    <div
                        style={{ backgroundImage: `url(${HomePic1})` }}
                        className="w-full h-[30rem] md:h-[40rem] lg:h-[50rem] bg-cover bg-center bg-no-repeat relative">
                        <div className='absolute flex flex-col justify-center items-center text-white backdrop-brightness-50 gap-3 md:gap-4 lg:gap-5 w-full h-full px-4 md:px-10'>
                            <p className='font-bold text-3xl md:text-5xl lg:text-6xl text-center'>
                                Welcome to <span className='text-yellow-500'>Rachit's Feast</span>
                            </p>
                            <div className='flex flex-col justify-center items-center text-center font-extrabold'>
                                <p className='text-sm md:text-base lg:text-lg font-semibold'>
                                    We provide a way to deliver your delicious meals at your doorstep.
                                </p>
                                <p className='text-sm md:text-base lg:text-lg font-semibold'>
                                    Now there is no need to go out in hot weather and get tired.
                                </p>
                                <p className='text-sm md:text-base lg:text-lg font-semibold'>
                                    Just order your meal now..
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='py-5 flex flex-col gap-3 md:gap-4 lg:gap-5'>
                    <p className='font-bold text-2xl md:text-3xl lg:text-4xl text-center'>
                        Find your delicious meals here
                    </p>
                    <FoodCircle />
                </div>
                <RestaurantList />
            </div>
        </AuthContext.Provider>
    )
}

export default RachitFeast
