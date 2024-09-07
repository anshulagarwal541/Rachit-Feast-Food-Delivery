import React, { useContext, useEffect, useState } from 'react';
import UserHeader from '../../components/User/UserHeader';
import UserOrderCard from './UserOrderCard';
import { AuthContext } from '../../Helpers/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

function UserOrders() {
  const { id } = useParams();
  const { url, error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType } = useContext(AuthContext);
  const [orders, setOrders] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data
    axios.get(`${url}/user`, {
      headers: {
        userAccessToken: localStorage.getItem("userAccessToken")
      }
    }).then((response) => {
      if (!response.data.error) {
        setUser(response.data);
      } else {
        setError(true)
        setErrorType("error")
        setErrorMessage(response.data.error);
      }
    });

    // Fetch orders
    axios.get(`${url}/user/orders`, {
      headers: {
        userAccessToken: localStorage.getItem("userAccessToken")
      }
    }).then((response) => {
      if (response.data.error) {
        setError(true)
        setErrorType("error")
        setErrorMessage(response.data.error);
      } else {
        setOrders(response.data);
      }
    });
  }, []);

  const handleClose = () => {
    setError(false);
    setErrorMessage(null);
    setErrorType(null)
  };

  return (
    <AuthContext.Provider value={{
      url, user, setOrders, error, setError,
      errorMessage, setErrorMessage,
      errorType, setErrorType
    }}>
      <div className="bg-indigo-50 min-h-screen">
        <UserHeader />
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
        <div className='p-5 md:p-10 flex flex-col justify-center items-center gap-8'>
          <p className='text-indigo-950 font-bold text-3xl md:text-4xl lg:text-5xl'>Order History</p>
          <div className='w-full flex flex-col justify-center items-center gap-5'>
            {orders && orders.length > 0 ? (
              orders.map((order, i) => (
                <UserOrderCard key={i} order={order} />
              ))
            ) : (
              <div className='w-full h-[60vh] flex justify-center items-center'>
                <div className='text-center font-bold text-2xl md:text-3xl'>No Orders found..</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default UserOrders;
