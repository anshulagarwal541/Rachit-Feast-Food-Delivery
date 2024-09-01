import React, { useContext, useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';

function BillingMenuCard({ billing }) {
    const { bill, setBill, url, restaurant, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [rider, setRider] = useState(null);

    useEffect(() => {
        axios.get(`${url}/rider`, {
            headers: {
                riderAccessToken: localStorage.getItem("riderAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRider(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    }, []);

    const handleAdd = () => {
        let found = false;
        const newBill = bill.map((element) => {
            if (element.item === billing.item) {
                found = true;
                return {
                    ...element,
                    quantity: element.quantity + 1
                };
            }
            return element;
        });
        const data = {
            foods: newBill,
            restaurantId: restaurant._id
        };
        axios.post(`${url}/user/bill`, data, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (response.data.error) {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
        setError(true)
        setErrorMessage("Successfully updated cart :)")
        setErrorType("success")
        setBill(newBill);
    };

    const handleRemove = () => {
        let found = false;
        const newBill = bill.map((element) => {
            if (element.item === billing.item) {
                found = true;
                return {
                    ...element,
                    quantity: element.quantity - 1
                };
            }
            return element;
        }).filter((element) => element.quantity > 0);
        const data = {
            foods: newBill,
            restaurantId: restaurant._id
        };
        axios.post(`${url}/user/bill`, data, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (response.data.error) {
                setError(false)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
        setError(true)
        setErrorMessage("Successfully updated cart :)")
        setErrorType("success")
        setBill(newBill);
    };

    return (
        <div className='flex flex-col md:flex-row bg-indigo-950 text-white justify-between gap-4 items-center w-full md:w-[95%] mx-auto my-2 p-4 rounded-lg shadow-md'>
            <div className='flex justify-center md:justify-evenly gap-2 items-center'>
                {!rider && (
                    <div onClick={handleAdd} className='cursor-pointer w-fit h-fit'>
                        <AddCircleIcon fontSize='large' />
                    </div>
                )}
                <p className='text-lg md:text-xl'>{billing.quantity}</p>
                {!rider && (
                    <div onClick={handleRemove} className='cursor-pointer w-fit h-fit'>
                        <RemoveCircleIcon fontSize='large' />
                    </div>
                )}
            </div>
            <p className='font-bold text-lg md:text-md text-center md:mt-0'>
                {billing.item}
            </p>
            <p className='text-lg md:text-xl md:mt-0'>
                {billing.price} Rs
            </p>
        </div>
    );
}

export default BillingMenuCard;
