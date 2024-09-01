import axios from 'axios'
import React, { useContext } from 'react'
import { AuthContext } from '../../../Helpers/AuthContext'
import { useNavigate } from 'react-router-dom';

function RiderBillInfo() {
    const navigate = useNavigate();
    const {
        order,
        url,
        restaurant,
        user,
        finalOrderForDelivery, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType
    } = useContext(AuthContext)

    const handleOrderNow = () => {
        let data = finalOrderForDelivery;
        data.restaurant = restaurant;
        data.user = user;
        console.log("final", data)
        axios.post(`${url}/user/placeOrder`, data, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                console.log(response.data)
            } else {
                console.log(response.data.error);
            }
        })
    }

    const handleCustomerCodeSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target)
        const data = {
            code: formData.get("code")
        }
        axios.post(`${url}/rider/order/complete`, data, {
            headers: {
                riderAccessToken: localStorage.getItem("riderAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage(response.data);
                navigate("/rider/home")
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        })
        e.target.reset();
    }

    return (
        <div className='relative w-full max-w-md flex flex-col gap-5 p-4'>
            <div className='bg-white w-full flex flex-col gap-5 p-4 rounded-2xl'>
                <p className='relative border-b-2 border-b-black py-2 font-bold text-indigo-950 text-xl md:text-2xl'>Contact information :</p>
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
                    <div className='flex justify-between gap-5 w-full'>
                        <p className='text-sm md:text-lg'>Address</p>
                        <p className='font-bold flex flex-wrap text-xs md:text-sm'>{order && order.user.address.name}</p>
                    </div>
                </div>
            </div>
            <div className='bg-white w-full flex gap-5 p-4 rounded-2xl'>
                <p className='text-indigo-950 font-bold text-center text-sm md:text-lg'>Tip Added :- </p>
                <div className='flex justify-evenly items-center text-sm md:text-lg'>
                    {order ? order.tip : 0.0} Rs
                </div>
            </div>
            <div className='bg-white w-full p-4 rounded-2xl'>
                <form onSubmit={handleCustomerCodeSubmit} action="POST" className='flex flex-col gap-3 justify-center items-center'>
                    <label htmlFor="customerCode" className='font-bold text-sm md:text-base'>Enter customer code here :- </label>
                    <input type="number" placeholder='4 Digit code here. Eg 1234' name="code" className='w-full border border-black rounded-2xl px-5 py-2 text-sm md:text-base' />
                    <button className='bg-indigo-950 text-white font-bold px-5 py-2 text-sm md:text-base'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default RiderBillInfo;
