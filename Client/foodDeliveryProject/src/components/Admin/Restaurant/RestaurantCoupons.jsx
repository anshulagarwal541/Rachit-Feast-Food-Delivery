import { Checkbox, FormControlLabel } from '@mui/material'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { FormGroup } from 'react-bootstrap'
import { AuthContext } from '../../../Helpers/AuthContext';
import { useParams } from 'react-router-dom';

function RestaurantCoupons() {
    const { url } = useContext(AuthContext)
    const { id } = useParams();
    const [coupons, setCoupons] = useState(null)
    const [restaurant, setRestaurant] = useState(null)
    const [selectedCoupons, setSelectedCoupons] = useState(new Set());

    useEffect(() => {
        axios.get(`${url}/admin/restaurant/${id}`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRestaurant(response.data);
                const ans = new Set(response.data.coupons.map(c => c._id));
                setSelectedCoupons(ans);
            }
            else {
                console.log(response.data.error)
            }
        })

        axios.get(`${url}/admin/coupons`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setCoupons(response.data)
            }
            else {
                console.log(response.data.error);
            }
        })

    }, [])

    const isCouponChecked = (couponId) => {
        return selectedCoupons && selectedCoupons.has(couponId);
    };

    const handleCheckboxChange = (couponId) => {
        const newSelectedCoupons = new Set(selectedCoupons);
        if (newSelectedCoupons.has(couponId)) {
            newSelectedCoupons.delete(couponId);
        } else {
            newSelectedCoupons.add(couponId);
        }
        setSelectedCoupons(newSelectedCoupons);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCouponsArray = Array.from(selectedCoupons);
        const data = {
            coupons: selectedCouponsArray
        }
        axios.post(`${url}/admin/restaurant/${id}/coupons/update`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                console.log(response.data)
            }
            else {
                console.log(response.data.error);
            }
        })
    }

    return (
        <div className='bg-indigo-50 h-[100vh] flex justify-center items-center'>
            <div className='bg-white rounded-2xl p-5 h-fit'>
                <p className='text-indigo-950 font-bold text-3xl text-center'>Update the Coupons</p>
                {(coupons && restaurant && coupons.length>0) ?
                    (
                        <form action="POST" onSubmit={handleSubmit} className='flex justify-center items-center flex-col'>
                            <div className='p-10 flex flex-col flex-wrap h-[20rem] gap-5'>
                                {coupons.map((coupon, i) => {
                                    return <FormControlLabel
                                        name={coupon._id}
                                        key={i}
                                        control={
                                            <Checkbox
                                                defaultChecked={isCouponChecked(coupon._id)}
                                                onChange={() => handleCheckboxChange(coupon._id)}
                                            />}
                                        label={`${coupon.title} (${coupon.discount}%)`}
                                    />
                                })}
                            </div>
                            <button className='bg-indigo-950 text-white font-bold px-5 py-3 '>Submit</button>
                        </form>
                    )
                    :
                    (
                        <p className='text-indigo-950 font-bold text-center text-2xl p-10'>No Coupons found yet..</p>
                    )
                }
            </div>
        </div>
    )
}

export default RestaurantCoupons