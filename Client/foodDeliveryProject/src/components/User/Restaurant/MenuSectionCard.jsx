import React, { useContext } from 'react';
import { PlusOne } from '@mui/icons-material';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';

function MenuSectionCard({ food }) {
    const { bill, setBill, url, restaurant, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);

    const handleItem = () => {
        if (!bill || bill.length === 0) {
            setBill([{
                item: food.name,
                price: food.price,
                quantity: 1
            }]);
        } else {
            let found = false;
            const newBill = bill.map((element) => {
                if (element.item === food.name) {
                    found = true;
                    return {
                        ...element,
                        quantity: element.quantity + 1
                    };
                }
                return element;
            });

            if (!found) {
                newBill.push({
                    item: food.name,
                    price: food.price,
                    quantity: 1
                });
            }
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
                    console.log(response.data.error);
                }
                else{
                    setError(true)
                    setErrorType("success")
                    setErrorMessage("Cart has been updated :)")
                }
            });
            setBill(newBill);
        }
    };

    return (
        <div className='bg-white flex flex-row justify-between items-center gap-4 md:gap-10 border border-indigo-950 rounded-2xl w-full  px-4 py-3 shadow-md'>
            <div className='flex flex-col items-start'>
                <p className='font-bold text-lg md:text-xl'>{food && food.name}</p>
                <p className='font-bold text-lg md:text-xl'>$ {food && food.price}</p>
            </div>
            <div className='bg-indigo-950 text-white font-bold p-2 md:p-3 rounded-full cursor-pointer'>
                <PlusOne onClick={handleItem} />
            </div>
        </div>
    );
}

export default MenuSectionCard;
