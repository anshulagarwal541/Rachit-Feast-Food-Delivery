import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Helpers/AuthContext'
import { useNavigate } from 'react-router-dom'

function BillInfo() {
  const {
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
    finalOrderForDelivery, setFinalOrderForDelivery, error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType
  } = useContext(AuthContext)

  const [tips, setTips] = useState(null)
  const [selectedTip, setSelectedTip] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isTipSelected) {
      setSelectedTip(null)
    }
  }, [isTipSelected])

  useEffect(() => {
    axios.get(`${url}/tips`).then((response) => {
      if (!response.data.error) {
        setTips(response.data)
      } else {
        console.log(response.data.error)
      }
    })
    setFinalOrderForDelivery(prev => ({ ...prev, orderDate: currentDate }))
  }, [])

  useEffect(() => {
    axios.get(`${url}/user/details`, {
      headers: {
        userAccessToken: localStorage.getItem("userAccessToken")
      }
    }).then((response) => {
      if (!response.data.error) {
        setUser(response.data)
        setNewAddress(response.data.address.name)
        if (restaurant) {
          haversineDistance(restaurant, response.data.address)
        }
      } else {
        response.json(response.data.error)
      }
    })
  }, [isAddressChanged])

  const handleOrderNow = () => {
    let data = finalOrderForDelivery
    data.restaurant = restaurant
    data.user = user
    axios.post(`${url}/user/placeOrder`, data, {
      headers: {
        userAccessToken: localStorage.getItem("userAccessToken")
      }
    }).then((response) => {
      if (!response.data.error) {
        setError(true)
        setErrorMessage("Order placed successfully..!!!")
        setErrorType("success")
        navigate("/user/order/complete/track")
      } else {
        console.log(response.data.error)
        navigate(`/`)
      }
    })
  }

  return (
    <div className='relative w-full max-w-[700px] mx-auto flex flex-col gap-5 h-fit p-4'>
      <div className='bg-white w-full flex flex-col gap-5 p-4 rounded-2xl shadow-md'>
        <p className='border-b-2 border-b-black py-2 font-bold text-indigo-950 text-2xl text-center'>Contact information :</p>
        <div className='flex flex-col gap-3 border-b-2 border-b-indigo-950 py-1'>
          <div className='flex justify-between text-lg'>
            <p>Name :</p>
            <p className='font-bold'>{user && user.name}</p>
          </div>
          <div className='flex justify-between text-lg'>
            <p>Email :</p>
            <p className='font-bold'>{user && user.email}</p>
          </div>
          <div className='flex justify-between text-lg'>
            <p>Phone :</p>
            <p className='font-bold'>{user && user.phone}</p>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex justify-between items-center gap-5 w-full'>
            <p className='text-lg'>Address</p>
            <p className='font-bold flex-wrap text-sm'>{user && user.address.name}</p>
          </div>
          <button onClick={() => { setAddAddress(true) }} className='bg-indigo-950 text-white font-bold px-5 py-2 rounded w-full'>New Address</button>
        </div>
      </div>
      <div className='bg-white w-full flex flex-col gap-5 p-4 rounded-2xl shadow-md'>
        <p className='text-indigo-950 font-bold text-center'>Add Tip ?</p>
        <div className='flex justify-evenly items-center gap-2'>
          {tips && (
            <>
              <button
                onClick={() => { setError(true); setErrorType("success"); setErrorMessage("Tip added :)"); setSelectedTip("tip1"); setIsTipSelected(true); setTip(tips.tip1) }}
                className={`${selectedTip === "tip1" ? "bg-indigo-950 text-white" : "border-2 border-indigo-950"} px-5 py-2 font-bold rounded`}
              >
                {tips.tip1} Rs
              </button>
              <button
                onClick={() => { setError(true); setErrorType("success"); setErrorMessage("Tip added :)"); setSelectedTip("tip2"); setIsTipSelected(true); setTip(tips.tip2) }}
                className={`${selectedTip === "tip2" ? "bg-indigo-950 text-white" : "border-2 border-indigo-950"} px-5 py-2 font-bold rounded`}
              >
                {tips.tip2} Rs
              </button>
              <button
                onClick={() => { setError(true); setErrorType("success"); setErrorMessage("Tip added :)"); setSelectedTip("tip3"); setIsTipSelected(true); setTip(tips.tip3) }}
                className={`${selectedTip === "tip3" ? "bg-indigo-950 text-white" : "border-2 border-indigo-950"} px-5 py-2 font-bold rounded`}
              >
                {tips.tip3} Rs
              </button>
            </>
          )}
        </div>
      </div>
      <div className='bg-white w-full p-4 rounded-2xl shadow-md'>
        {isPaymentPossible ?
          (
            <button onClick={handleOrderNow} className='bg-indigo-950 text-white font-bold px-5 py-2 w-full'>Pay Now</button>
          )
          :
          (
            <p className='text-red-700 font-bold text-center'>Restaurant does not deliver to current location.</p>
          )}
      </div>
    </div>
  )
}

export default BillInfo
