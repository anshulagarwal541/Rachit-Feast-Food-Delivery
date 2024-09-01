import React, { useState, useEffect, useContext } from 'react';
import CouponsTable from '../../components/Admin/Coupons/CouponsTable';
import AddCoupons from '../../components/Admin/Coupons/AddCoupons';
import { AuthContext } from '../../Helpers/AuthContext';
import axios from 'axios';

function Coupons() {
    const { url } = useContext(AuthContext);
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        axios.get(`${url}/admin/allCoupons`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken"),
            },
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetCoupon(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    }, []);

    const transformAndSetCoupon = (coupon) => {
        const transformedCoupon = coupon.map((res) => ({
            id: res._id,
            title: res.title,
            discount: res.discount,
            status: res.availability,
        }));
        setCoupons(transformedCoupon);
    };

    return (
        <AuthContext.Provider value={{ coupons, setCoupons, transformAndSetCoupon, url }}>
            <div className='min-h-screen flex flex-col justify-center gap-5 items-center p-4'>
                <AddCoupons />
                <CouponsTable />
            </div>
        </AuthContext.Provider>
    );
}

export default Coupons;
