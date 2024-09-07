import React, { useContext, useEffect, useState } from 'react'
import RestaurantSideBar from "./RestaurantSideBar.jsx";
import { Outlet, useParams } from 'react-router-dom'
import { AuthContext } from '../../../Helpers/AuthContext.js';
import axios from 'axios';
import RestaurantHeader from './RestaurantHeader.jsx';

function RestaurantDashboard({ children }) {
  const { url, error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType } = useContext(AuthContext);
  const [restaurant, setRestaurant] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const data = {
      _id: id
    }
    axios.post(`${url}/admin/getRestaurant`, data, {
      headers: {
        adminAccessToken: localStorage.getItem("adminAccessToken")
      }
    }).then((response) => {
      if (!response.data.error) {
        setRestaurant(response.data);
      }
      else {
        console.log(response.data.error);
      }
    })
  }, [])

  const reloadPage = () => {
    const data = {
      _id: id
    }
    axios.post(`${url}/admin/getRestaurant`, data, {
      headers: {
          adminAccessToken: localStorage.getItem("adminAccessToken")
      }
  }).then((response) => {
      if (!response.data.error) {
        console.log(response.data)
        setRestaurant(response.data);
      }
      else {
        console.log(response.data.error);
      }
    })
  }

  return (
    <AuthContext.Provider value={{ id, restaurant, setRestaurant, reloadPage, url, error, setError,
      errorMessage, setErrorMessage,
      errorType, setErrorType }}>
      <div className='flex'>
        <div className='hidden lg:block md:w-[17%] h-[100vh] bg-indigo-950'>
          <RestaurantSideBar />
        </div>
        <div className='w-full lg:w-[83%] min-h-[100vh] bg-indigo-50 overflow-y-scroll'>
          <RestaurantHeader />
          {children}
        </div>
      </div>
    </AuthContext.Provider>
  )
}

export default RestaurantDashboard