// import React, { useContext, useEffect, useState } from 'react'
// import { AuthContext } from '../../../Helpers/AuthContext'
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';

// function BillingTotal() {
//     const { bill, setBill, url, restaurant, setRestaurant, id } = useContext(AuthContext);
//     const [subTotal, setSubTotal] = useState(null)
//     const [tax, setTax] = useState(0)
//     const [totalAmount, setTotalAmount] = useState(null)
//     const [validCoupon, setValidCoupon] = useState(false);
//     const [couponDiscount, setCouponDiscount] = useState(0)
//     const [coupon, setCoupon] = useState(null)
//     const navigate = useNavigate();

//     useEffect(() => {
//         axios.get(`${url}/home/restaurant/${id}`).then((response) => {
//             if (!response.data.error) {
//                 setRestaurant(response.data);
//             }
//             else {
//                 console.log(response.data.error);
//             }
//         })
//     }, [])

//     useEffect(() => {
//         if (restaurant) {
//             setTax(restaurant.tax)
//         }
//         let total = 0;
//         if (bill) {
//             bill.map((b) => {
//                 total += parseInt(b.price) * parseInt(b.quantity);
//             })
//         }
//         setSubTotal(total)
//         if (total > 0) {
//             const dist = total * couponDiscount / 100.0;
//             total -= dist;
//             total += tax;
//         }
//         setTotalAmount(total)
//     }, [bill, validCoupon])

//     const handleCheckout = () => {
//         if((bill && bill.length==0) || (!bill))
//         {
//             return navigate('/')
//         }
//         const data = {
//             foods: bill,
//             restaurantId: restaurant._id
//         }
//         axios.post(`${url}/user/bill`, data, {
//             headers: {
//                 userAccessToken: localStorage.getItem("userAccessToken")
//             }
//         }).then((response) => {
//             if (!response.data.error) {
//                 navigate(`/restaurant/${id}/order/checkout`)
//             }
//             else {
//                 console.log(response.data.error);
//             }
//         })
//     }

//     return (
//         <div className='bg-white w-full flex flex-col gap-3 justify-center items-center p-4'>
//             <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
//                 <p>SubTotal :</p>
//                 <p className='font-bold'>Rs {subTotal}</p>
//             </div>
//             <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
//                 <p>Delivery Fees :</p>
//                 <p className='font-bold'>Rs 54</p>
//             </div>
//             <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
//                 <p>Tax Charges :</p>
//                 <p className='font-bold'>Rs {tax}</p>
//             </div>
//             <div className='border-b-2 border-black flex justify-between px-3 items-center py-2 w-full'>
//                 <p>Total Amount :</p>
//                 <p className='font-bold'>Rs {totalAmount}</p>
//             </div>
//             <button onClick={handleCheckout} className='bg-indigo-950 text-white font-bold px-5 py-2 w-fit'>CheckOut</button>
//         </div>
//     )
// }

// export default BillingTotal



import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function BillingTotal() {
    const { bill, setBill, url, restaurant, setRestaurant, id, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [subTotal, setSubTotal] = useState(null);
    const [tax, setTax] = useState(0);
    const [totalAmount, setTotalAmount] = useState(null);
    const [validCoupon, setValidCoupon] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [coupon, setCoupon] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${url}/home/restaurant/${id}`).then((response) => {
            if (!response.data.error) {
                setRestaurant(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    }, []);

    useEffect(() => {
        if (restaurant) {
            setTax(restaurant.tax);
        }
        let total = 0;
        if (bill) {
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
        setTotalAmount(total);
    }, [bill, validCoupon]);

    const handleCheckout = () => {
        if ((bill && bill.length == 0) || !bill) {
            setError(true)
            setErrorType("warning")
            setErrorMessage("Please add delicious items in your cart first..!! Then only you can checkout.. :)")
            return navigate('/');
        }
        const data = {
            foods: bill,
            restaurantId: restaurant._id,
        };
        axios.post(`${url}/user/bill`, data, {
            headers: {
                userAccessToken: localStorage.getItem('userAccessToken'),
            },
        }).then((response) => {
            if (!response.data.error) {
                navigate(`/restaurant/${id}/order/checkout`);
            } else {
                console.log(response.data.error);
            }
        });
    };

    return (
        <div className="bg-white text-black w-full flex flex-col gap-3 justify-center items-center p-4 md:p-6 lg:p-8">
            <div className="border-b-2 border-black flex justify-between px-3 items-center py-2 w-full md:text-lg">
                <p>SubTotal :</p>
                <p className="font-bold">Rs {subTotal}</p>
            </div>
            <div className="border-b-2 border-black flex justify-between px-3 items-center py-2 w-full md:text-lg">
                <p>Delivery Fees :</p>
                <p className="font-bold">Rs 54</p>
            </div>
            <div className="border-b-2 border-black flex justify-between px-3 items-center py-2 w-full md:text-lg">
                <p>Tax Charges :</p>
                <p className="font-bold">Rs {tax}</p>
            </div>
            <div className="border-b-2 border-black flex justify-between px-3 items-center py-2 w-full md:text-lg">
                <p>Total Amount :</p>
                <p className="font-bold">Rs {totalAmount}</p>
            </div>
            <button
                onClick={handleCheckout}
                className="bg-indigo-950 text-white font-bold px-5 py-2 w-fit md:px-6 md:py-3 lg:px-8 lg:py-4"
            >
                CheckOut
            </button>
        </div>
    );
}

export default BillingTotal;
