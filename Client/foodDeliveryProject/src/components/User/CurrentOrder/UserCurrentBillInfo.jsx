import axios from 'axios'
import React, { useContext } from 'react'
import { AuthContext } from '../../../Helpers/AuthContext'
import { useNavigate } from 'react-router-dom'

function UserCurrentBillInfo() {
    const navigate = useNavigate();
    const {
        order,
        currentDate,
        bill, setBill,
        url,
        addAddress, setAddAddress,
        setNewAddress,
        isAddressChanged,
        user, setUser,
        setIsTipSelected, isTipSelected,
        setTip,
        isPaymentPossible, setIsPaymentPossible,
        haversineDistance,
        restaurant,
        finalOrderForDelivery, setFinalOrderForDelivery
    } = useContext(AuthContext)

    return (
        <div className='relative w-full md:w-1/2 flex flex-col gap-5 h-fit'>
            <div className='bg-white w-full flex flex-col gap-5 p-4 rounded-2xl'>
                <p className='relative border-b-2 border-b-black py-2 font-bold text-indigo-950 text-lg md:text-2xl'>Contact Information :</p>
                <div className='relative flex flex-col gap-3 border-b-2 border-b-indigo-950 py-1'>
                    <div className='flex justify-between text-sm md:text-lg'>
                        <p>Name :</p>
                        <p className='font-bold'>{order && order.user.name}</p>
                    </div>
                    <div className='flex justify-between text-sm md:text-lg'>
                        <p>Email :</p>
                        <p className='font-bold'>{order && order.user.email}</p>
                    </div>
                    <div className='flex justify-between text-sm md:text-lg'>
                        <p>Phone :</p>
                        <p className='font-bold'>{order && order.user.phone}</p>
                    </div>
                </div>
                <div className='relative flex flex-col gap-3'>
                    <div className='flex flex-col md:flex-row justify-between gap-5 w-full '>
                        <p className='text-sm md:text-lg'>Address:</p>
                        <p className='font-bold flex flex-wrap text-xs md:text-sm'>{order && order.user.address.name}</p>
                    </div>
                </div>
            </div>
            <div className='bg-white w-full flex gap-5 p-4 rounded-2xl'>
                <p className='text-indigo-950 font-bold text-center text-sm md:text-base'>Tip Added:</p>
                <div className='flex justify-evenly items-center text-sm md:text-base'>
                    {order ? order.tip : 0.0} Rs
                </div>
            </div>
            {order && order.rider && (
                <div className='bg-white w-full flex flex-col justify-start items-start gap-1 p-4 rounded-2xl'>
                    <p className='text-indigo-950 font-bold text-center text-sm md:text-base'>Rider Name: {order.rider.name}</p>
                    <p className='text-indigo-950 font-bold text-center text-sm md:text-base'>Phone Number: {order.rider.phone}</p>
                    <p className='text-indigo-950 font-bold text-center text-sm md:text-base'>Rating: {order.rider.totalRating}.0 / 5.0</p>
                </div>
            )}
        </div>
    )
}

export default UserCurrentBillInfo
