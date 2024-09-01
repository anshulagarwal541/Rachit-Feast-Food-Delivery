import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Helpers/AuthContext';
import BillingMenuCard from '../../components/User/Restaurant/BillingMenuCard';
import BillingTotal from '../../components/User/Restaurant/BillingTotal';
import axios from 'axios';

function BillList() {
    const {
        bill, setBill,
        restaurant,
        url,
        isTipSelected, setIsTipSelected,
        tip, setTip,
        finalOrderForDelivery, setFinalOrderForDelivery,
        currentDate, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType
    } = useContext(AuthContext);
    const [subTotal, setSubTotal] = useState(null);
    const [tax, setTax] = useState(0);
    const [totalAmount, setTotalAmount] = useState(null);
    const [validCoupon, setValidCoupon] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [coupon, setCoupon] = useState(null);
    const [finalAmountConsideringTip, setFinalAmountConsideringTip] = useState(null);

    useEffect(() => {
        if (restaurant) {
            setTax(restaurant.tax);
            setFinalOrderForDelivery({ tax: restaurant.tax });
        }
        let total = 0;
        if (bill) {
            setFinalOrderForDelivery(prev => ({ ...prev, items: bill }));
            bill.map((b) => {
                total += parseInt(b.price) * parseInt(b.quantity);
            });
        }
        setSubTotal(total);
        if (total > 0) {
            const dist = (total * couponDiscount) / 100.0;
            total -= dist;
            total += tax;
        }

        if (validCoupon) {
            setFinalOrderForDelivery(prev => ({ ...prev, couponDiscount: couponDiscount, couponName: coupon, totalAmount: total, orderDate: currentDate }));
        }

        setTotalAmount(total);
        setFinalAmountConsideringTip(total);
        setFinalOrderForDelivery(prev => ({ ...prev, totalAmount: total, couponDiscount: couponDiscount, couponName: coupon, orderDate: currentDate }));
    }, [bill, validCoupon]);

    useEffect(() => {
        setFinalAmountConsideringTip(totalAmount + tip);
        setFinalOrderForDelivery(prev => ({ ...prev, totalAmount: tip + totalAmount, tip: tip, orderDate: currentDate }));
    }, [tip]);

    const handleCouponSubmit = (e) => {
        e.preventDefault();
        const data = {
            restaurantId: restaurant._id,
            coupon: coupon
        };
        axios.post(`${url}/confirmCoupon`, data).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage("Coupon is added :)")
                setValidCoupon(true);
                setCouponDiscount(response.data);
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
    };

    const handleCoupon = (e) => {
        setCoupon(e.target.value);
    };

    const removeCoupon = () => {
        setValidCoupon(false);
        setCouponDiscount(0);
        setCoupon(null);
        setFinalOrderForDelivery(prev => ({ ...prev, couponDiscount: 0.0, couponName: "N.A" }));
    };

    const removeTip = () => {
        setError(true)
        setErrorType("success")
        setErrorMessage("Tip removed .. :)")
        setIsTipSelected(false);
        setTip(null);
        setFinalOrderForDelivery(prev => ({ ...prev, tip: "N.A" }));
    };

    return (
        <AuthContext.Provider value={{
            bill, setBill, url, restaurant, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType
        }}>
            <div className='w-full mx-auto p-4'>
                <div className='flex flex-col gap-5'>
                    <div className='rounded-2xl px-5 bg-white w-full overflow-y-scroll h-[10rem] flex flex-col gap-3 items-center py-3'>
                        {bill && bill.length > 0 ? (
                            bill.map((b, i) => (
                                <BillingMenuCard key={i} billing={b} />
                            ))
                        ) : (
                            <div className='text-indigo-950 font-bold text-2xl'>Please add item..</div>
                        )}
                    </div>
                    <div className='bg-white p-5 rounded-2xl'>
                        <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
                            <form onSubmit={handleCouponSubmit} action="POST" className='w-full flex flex-col justify-center items-center gap-2'>
                                <label htmlFor="couponCode" className='font-bold text-indigo-950 flex justify-center text-xl w-full'>Add Coupon :</label>
                                <input
                                    onChange={handleCoupon}
                                    value={coupon ? coupon : ""}
                                    type="text"
                                    placeholder='coupon code: eg SALES50'
                                    name="couponCode"
                                    className='border border-1 border-black px-5 py-3 rounded-2xl w-full'
                                />
                                <button type="submit" className='bg-indigo-950 px-5 py-3 font-bold text-white'>Apply</button>
                            </form>
                        </div>
                        {validCoupon && (
                            <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
                                <div className='flex flex-col gap-1 justify-start items-start'>
                                    <p className='font-bold'>Coupon :</p>
                                    <button onClick={removeCoupon} className='text-indigo-950 font-bold px-5 py-2 rounded-xl border-2 border-indigo-950'>Remove</button>
                                </div>
                                <div className='flex flex-col gap-1 justify-end items-end'>
                                    <p className='font-bold'>{coupon}</p>
                                    <p className='font-bold'>{couponDiscount}% </p>
                                </div>
                            </div>
                        )}
                        <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
                            <p>SubTotal :</p>
                            <p className='font-bold'>Rs {subTotal}</p>
                        </div>
                        <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
                            <p>Delivery Fees :</p>
                            <p className='font-bold'>Rs 54</p>
                        </div>
                        <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
                            <p>Tax Charges :</p>
                            <p className='font-bold'>Rs {tax}</p>
                        </div>
                        {isTipSelected && (
                            <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
                                <div className='flex flex-col gap-1 justify-start items-start'>
                                    <p className='font-bold'>Tip :</p>
                                    <button onClick={removeTip} className='text-indigo-950 font-bold px-5 py-2 rounded-xl border-2 border-indigo-950'>Remove</button>
                                </div>
                                <div className='flex flex-col gap-1 justify-end items-end'>
                                    <p className='font-bold'>{tip} Rs</p>
                                </div>
                            </div>
                        )}
                        <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
                            <p>Total Amount :</p>
                            <p className='font-bold'>Rs {finalAmountConsideringTip}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export default BillList;
