import React, { useContext } from 'react'
import { foodDeliveryLogo } from '../../../../public'
import BillingMenuCard from './BillingMenuCard'
import BillingTotal from './BillingTotal'
import { AuthContext } from '../../../Helpers/AuthContext'
function BillDetails() {
    const { bill, setBill, restaurant, setRestaurant, url, id, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);

    return (
        <AuthContext.Provider value={{ bill, setBill, url, id, restaurant, setRestaurant, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType }}>
            <div className='w-[95%] h-full mx-auto py-3 flex flex-col gap-5 '>
                <div className='flex items-center justify-center gap-2 h-[20%]'>
                    <img src={foodDeliveryLogo} alt="" className='bg-white p-2 border border-1 border-black rounded-full w-[5rem] h-[5rem]' />
                    <div className='flex flex-col'>
                        <p className='font-bold text-xl text-white lg:text-indigo-950'>Delivery Time</p>
                        <p>{restaurant && restaurant.deliveryTime} minutes</p>
                        <p>Restaurant's name</p>
                    </div>
                </div>
                <div className='flex flex-col gap-5'>
                    <div className='bg-white border-4 px-5 border-yellow-500 lg:border-none overflow-y-scroll h-[10rem] flex flex-col gap-3 items-center py-3'>
                        {bill && bill.length>0 ?
                            (bill.map((b, i) => {
                                return <BillingMenuCard key={i} billing={b} />
                            }))
                            :
                            (
                                <div className='text-indigo-950 font-bold text-2xl'>Please add item..</div>
                            )
                        }
                    </div>
                    <BillingTotal />
                </div>
            </div>
        </AuthContext.Provider>
    )
}

export default BillDetails