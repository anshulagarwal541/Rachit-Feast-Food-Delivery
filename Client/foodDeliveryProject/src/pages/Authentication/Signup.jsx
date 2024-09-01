import React, { useContext } from 'react';
import { HomePic1 } from '../../../public';
import UserHeader from '../../components/User/UserHeader';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Helpers/AuthContext';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

function Signup() {
  const { url, setUser, error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
      phone: formData.get("phone")
    };
    e.target.reset();
    axios.post(`${url}/signup`, data).then((response) => {
      if (!response.data.error) {
        localStorage.setItem("userAccessToken", response.data);
        const accessToken = localStorage.getItem("userAccessToken");
        setUser(accessToken);
        setError(true)
        setErrorType("success")
        setErrorMessage("Successfully logged in....");
        navigate("/");
      } else {
        setError(true)
        setErrorType("error")
        setErrorMessage(response.data.error);
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
        <div className='bg-white w-[90%] md:w-[70%] lg:w-[50%] max-w-md md:max-w-lg lg:max-w-xl h-fit rounded-xl flex flex-col gap-5 justify-start items-center p-5 md:p-10'>
          <p className='font-bold text-2xl md:text-3xl text-indigo-950'>Signup</p>
          <form onSubmit={handleSignup} className='flex flex-col justify-center items-center gap-3 w-full border-b-2 pb-5 border-b-black'>
            <div className='flex flex-col md:flex-row gap-5 w-full px-5'>
              <div className='flex flex-col w-full gap-1'>
                <label className='font-bold text-lg md:text-xl' htmlFor="name">Enter full name</label>
                <input
                  className='border border-1 border-black px-5 py-2 rounded-full w-full'
                  type="text"
                  id="name"
                  placeholder="name"
                  name="name"
                  required />
              </div>
              <div className='flex flex-col w-full gap-1'>
                <label className='font-bold text-lg md:text-xl' htmlFor="username">Enter username</label>
                <input
                  className='border border-1 border-black px-5 py-2 rounded-full w-full'
                  type="text"
                  id="username"
                  placeholder="username"
                  name="username"
                  required />
              </div>
            </div>
            <div className='flex flex-col w-full gap-1 px-5'>
              <label className='font-bold text-lg md:text-xl' htmlFor="email">Enter email</label>
              <input
                className='border border-1 border-black px-5 py-2 rounded-full w-full'
                type="email"
                id="email"
                placeholder="email"
                name="email"
                required />
            </div>
            <div className='flex flex-col w-full gap-1 px-5'>
              <label className='font-bold text-lg md:text-xl' htmlFor="phone">Enter phone</label>
              <input
                className='border border-1 border-black px-5 py-2 rounded-full w-full'
                type="number"
                id="phone"
                placeholder="phone"
                name="phone"
                required />
            </div>
            <div className='flex flex-col w-full gap-1 px-5'>
              <label className='font-bold text-lg md:text-xl' htmlFor="password">Enter password</label>
              <input
                className='border border-1 border-black px-5 py-2 rounded-full w-full'
                type="password"
                id="password"
                placeholder="password"
                name="password"
                required />
            </div>
            <button className='bg-indigo-950 text-white font-bold w-[90%] md:w-[70%] mx-auto px-5 py-2 text-lg md:text-xl'>Signup</button>
          </form>
          <div className='w-full px-5 flex flex-col gap-3 justify-center items-center'>
            <div className='flex items-center md:items-start gap-2 w-full'>
              <p className='font-bold text-lg md:text-xl'>Already registered?</p>
              <Link to="/user/login" className="font-semibold text-indigo-950 hover:underline">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
