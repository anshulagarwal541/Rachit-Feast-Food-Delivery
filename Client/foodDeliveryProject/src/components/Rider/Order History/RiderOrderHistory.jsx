import React, { useContext, useEffect, useState } from 'react'
import RiderHeader from '../../../pages/Rider/Header/RiderHeader'
import RiderOrderCard from './RiderOrderCard'
import { AuthContext } from '../../../Helpers/AuthContext'
import axios from 'axios'

function RiderOrderHistory() {
  const { url } = useContext(AuthContext);
  const [orders, setOrders] = useState(null);
  const [rider, setRider] = useState(null);

  useEffect(() => {
    axios.get(`${url}/rider`, {
      headers: {
        riderAccessToken: localStorage.getItem("riderAccessToken")
      }
    }).then((response) => {
      if (!response.data.error) {
        setRider(response.data);
      } else {
        console.log(response.data.error);
      }
    })

    axios.get(`${url}/rider/orders`, {
      headers: {
        riderAccessToken: localStorage.getItem("riderAccessToken")
      }
    }).then((response) => {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        setOrders(response.data)
      }
    })
  }, [url])

  return (
    <div className="bg-indigo-50 h-[100vh]">
      <RiderHeader />
      <div className='p-4 md:p-10 flex flex-col justify-center items-center gap-5 md:gap-10'>
        <p className='text-indigo-950 font-bold text-3xl md:text-5xl'>Order History</p>
        <div className='w-full flex flex-col justify-center items-center gap-5'>
          {orders && orders.length > 0 ?
            (
              orders.map((order, i) => (
                <RiderOrderCard key={i} order={order} />
              ))
            )
            :
            (
              <div className='flex justify-center items-center font-bold text-xl md:text-3xl'>No Orders found..</div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default RiderOrderHistory;
