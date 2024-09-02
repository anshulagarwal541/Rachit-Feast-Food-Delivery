import React, { useContext } from 'react';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCoupons() {
    const { url, setCoupons, transformAndSetCoupon, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRider = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            title: formData.get("title"),
            discount: formData.get("discount"),
        };
        axios.post(`${url}/admin/addCoupon`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken"),
            },
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetCoupon(response.data);
                setError(true)
                setErrorType("success")
                setErrorMessage("Successfully added a new coupon .. :)")
                navigate("/admin/coupons");
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
        e.target.reset();
    };

    return (
        <div className='w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 mx-auto'>
            <p className='bg-indigo-950 text-white px-3 py-4 w-full md:w-[40%] text-xl rounded-r-full rounded-tl-2xl mb-4 text-center'>
                Add Coupons
            </p>
            <form action="POST" onSubmit={handleRider} className='flex flex-col gap-4'>
                <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
                    <div className='flex flex-col gap-2 w-full md:w-1/2 p-2'>
                        <label htmlFor="code" className='font-bold text-start'>Code</label>
                        <input
                            required
                            type="text"
                            id="code"
                            name="title"
                            placeholder='Code: e.g. SALE50'
                            className='px-4 py-2 rounded-full shadow-md w-full'
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full md:w-1/2 p-2'>
                        <label htmlFor="discount" className='font-bold'>Discount</label>
                        <input
                            type="number"
                            id="discount"
                            required
                            name="discount"
                            placeholder='Discount % (1-99)'
                            className='px-4 py-2 rounded-full shadow-md w-full'
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className='mx-auto w-full md:w-auto px-6 py-2 bg-indigo-950 text-white font-bold rounded-full'
                >
                    Save
                </button>
            </form>
        </div>
    );
}

export default AddCoupons;
