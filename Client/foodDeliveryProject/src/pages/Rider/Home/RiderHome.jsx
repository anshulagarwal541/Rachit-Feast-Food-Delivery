import React, { useContext, useEffect, useState } from 'react'
import RiderHeader from '../Header/RiderHeader.jsx'
import RiderHomeComponent from './RiderHomeComponent.jsx';
import { AuthContext } from '../../../Helpers/AuthContext.js';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

function RiderHome() {
  const [rider, setRider] = useState(null);
  const { url, error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType } = useContext(AuthContext);
  useEffect(() => {
    axios.get(`${url}`)
  }, [])

  const handleClose = () => {
    setError(false);
    setErrorMessage(null);
    setErrorType(null)
  };

  return (
    <AuthContext.Provider value={{
      url, error, setError,
      errorMessage, setErrorMessage,
      errorType, setErrorType
    }}>
      <div className='bg-indigo-50 h-[100vh]'>
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
        <RiderHeader />
        <RiderHomeComponent />
      </div>
    </AuthContext.Provider>
  )
}

export default RiderHome;