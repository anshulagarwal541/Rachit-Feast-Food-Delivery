import React, { useContext } from 'react';
import { HomePic1 } from '../../../public';
import UserHeader from '../../components/User/UserHeader';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';
import { Alert, Snackbar } from '@mui/material';

function Login() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get("username"),
            password: formData.get("password")
        };
        e.target.reset();
        axios.post(`${url}/login`, data).then((response) => {
            if (!response.data.error) {
                localStorage.setItem("userAccessToken", response.data);
                setError(true)
                setErrorType("success")
                setErrorMessage("Successfully logged in ....");
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
            className='relative bg-center bg-no-repeat bg-cover min-h-screen backdrop-brightness-50 w-full'
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
            <div className='absolute px-5 inset-0 backdrop-brightness-50 backdrop-blur-sm w-full min-h-screen flex items-center justify-center'>
                <div className='bg-white w-full max-w-md md:max-w-lg lg:max-w-xl h-fit rounded-xl flex flex-col gap-5 justify-start items-center p-5 md:p-10'>
                    <p className='font-bold text-2xl md:text-3xl text-indigo-950'>Login</p>
                    <form onSubmit={handleLogin} className='flex flex-col justify-center items-center gap-3 w-full border-b-2 pb-5 border-b-black'>
                        <div className='flex flex-col w-full gap-2'>
                            <label
                                className='font-bold text-lg md:text-xl'
                                htmlFor="username"
                            >Enter username</label>
                            <input
                                className='border border-1 border-black px-5 py-2 rounded-full w-full'
                                type="text"
                                id="username"
                                placeholder="username"
                                name="username"
                                required />
                        </div>
                        <div className='flex flex-col w-full gap-2'>
                            <label className='font-bold text-lg md:text-xl' htmlFor="password">Enter password</label>
                            <input
                                className='border border-1 border-black px-5 py-2 rounded-full w-full'
                                type="password"
                                id="password"
                                placeholder="password"
                                name="password"
                                required />
                        </div>
                        <button className='bg-indigo-950 text-white font-bold w-full px-5 py-2 text-lg md:text-xl'>Login</button>
                    </form>
                    <div className='w-full flex flex-col gap-3'>
                        <div className='flex flex-row gap-2 items-center w-full justify-between'>
                            <p className='font-bold text-lg md:text-xl'>Not registered ?</p>
                            <Link to="/user/signup" className="font-semibold bg-indigo-950 text-white px-5 py-2 text-center w-auto">Signup</Link>
                        </div>
                        <div className='flex flex-row gap-2 items-center w-full justify-between'>
                            <p className='font-bold text-lg md:text-xl'>Login as admin ?</p>
                            <Link to="/admin/login" className="font-semibold bg-indigo-950 text-white px-5 py-2 text-center w-auto">Login</Link>
                        </div>
                        <div className='flex flex-row gap-2 items-center w-full justify-between'>
                            <p className='font-bold text-lg md:text-xl'>Login as rider ?</p>
                            <Link to="/rider/login" className="font-semibold bg-indigo-950 text-white px-5 py-2 text-center w-auto">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
