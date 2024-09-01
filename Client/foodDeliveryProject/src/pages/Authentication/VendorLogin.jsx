import React, { useContext } from 'react'
import { HomePic1 } from '../../../public'
import UserHeader from '../../components/User/UserHeader'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';


function VendorLogin() {
    const { url } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        }
        e.target.reset();
        axios.post(`${url}/vendor/login`, data).then((response) => {
            if (!response.data.error) {
                localStorage.setItem("vendorAccessToken", response.data);
                navigate("/")
            }
            else {
                console.log(response.data.error);
            }
        })
    }

    return (
        <div
            style={{
                backgroundImage: `url(${HomePic1})`
            }}
            className='relative bg-center bg-no-repeat bg-cover h-[100vh] backdrop-brightness-50'
        >
            <div className='absolute h-[100vh] backdrop-brightness-50 backdrop-blur-sm brightness-100 w-full'>
                <div className='w-full flex justify-center items-center my-10'>
                    <div className='bg-white w-[500px] h-fit rounded-xl flex flex-col gap-5 justify-start items-center p-10'>
                        <p className='font-bold text-3xl text-indigo-950'>Vendor Login</p>
                        <form onSubmit={handleLogin} action="POST" className='flex flex-col justify-center items-center gap-3 w-[95%] mx-auto border-b-2 pb-5 border-b-black'>
                            <div className='flex flex-col w-[90%] gap-2'>
                                <label
                                    className='font-bold text-xl'
                                    htmlFor="username"
                                >Enter vendor email address</label>
                                <input
                                    className='border border-1 border-black px-5 py-2 rounded-full w-[100%]'
                                    type="text"
                                    id="username"
                                    placeholder="email"
                                    name="email"
                                    required />
                            </div>
                            <div className='flex flex-col w-[90%] gap-2'>
                                <label className='font-bold text-xl' htmlFor="password">Enter vendor pin</label>
                                <input
                                    className='border border-1 border-black px-5 py-2 rounded-full w-[100%]'
                                    type="password"
                                    id="password"
                                    placeholder="password"
                                    name="password"
                                    required />
                            </div>
                            <button className='bg-indigo-950 text-white font-bold w-[90%] mx-auto px-5 py-2 text-xl'>Login</button>
                        </form>
                        <div className='w-[95%] mx-auto flex flex-col gap-3'>
                            <div className='flex gap-2 items-center w-full justify-between'>
                                <p className='font-bold text-xl'>Back to Login ?</p>
                                <Link to="/user/login" className="font-semibold bg-indigo-950 text-white px-5 py-2">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendorLogin