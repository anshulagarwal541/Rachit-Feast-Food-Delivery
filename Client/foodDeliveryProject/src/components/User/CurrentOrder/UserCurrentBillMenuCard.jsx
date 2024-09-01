import React, { useContext } from 'react';
import { AuthContext } from '../../../Helpers/AuthContext';

function UserCurrentBillMenuCard({ billing }) {
    const { bill, setBill, url, restaurant } = useContext(AuthContext);

    return (
        <div className='flex flex-col md:flex-row bg-indigo-950 text-white justify-between items-center w-full md:w-[95%] rounded p-3 gap-3'>
            <div className='flex justify-center items-center gap-5'>
                <p className='font-bold text-lg'>{billing.quantity}</p>
                <p className='font-bold text-lg'>{billing.item}</p>
            </div>
            <p className='font-bold text-lg'>
                {billing.price} Rs
            </p>
        </div>
    );
}

export default UserCurrentBillMenuCard;
