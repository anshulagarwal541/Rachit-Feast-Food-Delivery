import React, { useContext } from 'react';
import { HomePic1 } from '../../../public';
import UserHeader from '../../components/User/UserHeader';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';
import { Alert, Snackbar } from '@mui/material';

function AdminLogin() {
  const { url, error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      adminId: formData.get("adminId"),
      adminPin: formData.get("adminPin")
    };
    e.target.reset();
    axios.post(`${url}/admin/login`, data).then((response) => {
      if (!response.data.error) {
        localStorage.setItem("adminAccessToken", response.data);
        setError(true)
        setErrorType("success")
        setErrorMessage("Successfully..!! logged in.....")
        navigate("/admin");
      } else {
        setError(true)
        setErrorType("error")
        setErrorMessage(response.data.error)
      }
    });
  }

  const handleClose = () => {
    setError(false);
    setErrorMessage(null);
    setErrorType(null)
};

  return (
    <div
      style={{
        backgroundImage: `url(${HomePic1})`
      }}
      className='relative bg-center bg-no-repeat bg-cover min-h-screen backdrop-brightness-50'
    >
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
      <div className='absolute inset-0 backdrop-brightness-50 backdrop-blur-sm w-full flex items-center justify-center'>
        <div className='bg-white w-[90%] md:w-[70%] lg:w-[50%] max-w-md md:max-w-lg lg:max-w-xl rounded-xl flex flex-col gap-5 justify-start items-center p-5 md:p-10'>
          <p className='font-bold text-2xl md:text-3xl text-indigo-950'>Admin Login</p>
          <form onSubmit={handleLogin} className='flex flex-col gap-5 w-full'>
            <div className='flex flex-col gap-3 px-5 w-full'>
              <label className='font-bold text-lg md:text-xl' htmlFor="adminId">Enter admin id</label>
              <input
                className='border border-1 border-black px-4 py-2 rounded-full w-full'
                type="text"
                id="adminId"
                placeholder="admin id"
                name="adminId"
                required
              />
            </div>
            <div className='flex flex-col gap-3 px-5 w-full'>
              <label className='font-bold text-lg md:text-xl' htmlFor="adminPin">Enter admin pin</label>
              <input
                className='border border-1 border-black px-4 py-2 rounded-full w-full'
                type="password"
                id="adminPin"
                placeholder="admin pin"
                name="adminPin"
                required
              />
            </div>
            <button className='bg-indigo-950 text-white font-bold w-full px-5 py-2 text-lg md:text-xl'>Login</button>
          </form>
          <div className='w-full px-5 flex flex-col gap-3 items-center'>
            <div className='flex flex-col items-center gap-2 w-full'>
              <p className='font-bold text-lg md:text-xl'>Back to Login?</p>
              <Link to="/user/login" className="font-semibold text-indigo-950 hover:underline">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
