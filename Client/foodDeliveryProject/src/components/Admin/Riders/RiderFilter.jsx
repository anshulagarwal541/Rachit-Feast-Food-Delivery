import React, { useContext } from 'react';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';

function RiderFilter() {
    const { riders, setRiders, transformAndSetRider, url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);

    const handleNewRider = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get("username"),
            name: formData.get("name"),
            password: formData.get("password"),
            phone: formData.get("phone"),
        };
        axios.post(`${url}/admin/postRider`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken"),
            },
        }).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage("Successfully added a new rider.. :)")
                transformAndSetRider(response.data);
            } else {
                setError(true)
                setErrorType("warning")
                setErrorMessage(response.data.error);
            }
        });
        e.target.reset();
    };

    return (
        <div className='w-full max-w-2xl bg-white rounded-2xl shadow-md mx-auto p-4'>
            <p className='bg-indigo-950 text-white px-3 py-2 text-xl rounded-r-full rounded-tl-2xl'>
                Graph Filter
            </p>
            <form action="POST" onSubmit={handleNewRider} className='flex flex-col gap-4 py-3'>
                <div className='flex flex-col md:flex-row md:justify-between'>
                    <div className='flex flex-col gap-1 w-full md:w-[48%] p-2'>
                        <label htmlFor="name" className='font-bold text-start'>Name</label>
                        <input required type="text" id="name" name="name" placeholder='name'
                            className='px-5 py-2 rounded-full shadow-black shadow-md w-full' />
                    </div>
                    <div className='flex flex-col gap-1 w-full md:w-[48%] p-2'>
                        <label htmlFor="username" className='font-bold'>Username</label>
                        <input required type="text" id="username" name="username" placeholder='username'
                            className='px-5 py-2 rounded-full shadow-black shadow-md w-full' />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row md:justify-between'>
                    <div className='flex flex-col gap-1 w-full md:w-[48%] p-2'>
                        <label htmlFor="password" className='font-bold'>Password</label>
                        <input required type="password" name="password" id="password" placeholder='password'
                            className='px-5 py-2 rounded-full shadow-black shadow-md w-full' />
                    </div>
                    <div className='flex flex-col gap-1 w-full md:w-[48%] p-2'>
                        <label htmlFor="phone" className='font-bold'>Phone No</label>
                        <input required type="number" id="phone" name="phone" placeholder='phone number'
                            className='px-5 py-2 rounded-full shadow-black shadow-md w-full' />
                    </div>
                </div>
                <button type="submit" className='mx-auto w-full md:w-auto px-5 py-2 bg-indigo-950 text-white font-bold rounded-full'>
                    Save
                </button>
            </form>
        </div>
    );
}

export default RiderFilter;
