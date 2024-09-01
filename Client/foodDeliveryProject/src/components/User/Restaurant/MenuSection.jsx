import React, { useContext, useEffect, useState } from 'react';
import MenuSectionCard from './MenuSectionCard';
import { AuthContext } from '../../../Helpers/AuthContext';

function MenuSection({ category, restaurant }) {
    const { bill, setBill, url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        if (category && category.name) {
            const filteredFoods = restaurant.foods.filter(food => food.category === category.name);
            setFoods(filteredFoods);
        } else if (category && !category.name) {
            const filteredFoods = restaurant.foods.filter(food => food.category === category);
            setFoods(filteredFoods);
        }
    }, [category, restaurant.foods]);

    return (
        <AuthContext.Provider value={{ bill, setBill, url, restaurant, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType }}>
            <div className='bg-white w-full md:w-[95%] mx-auto flex flex-col justify-center items-center gap-5 py-5 rounded-2xl shadow-lg'>
                {category && (
                    <p className='font-bold text-2xl md:text-3xl text-center'>{category.name || category}</p>
                )}
                <div className='w-full flex flex-wrap gap-3 md:gap-5 mx-auto justify-center md:justify-start px-5'>
                    {foods.length > 0 ? (
                        foods.map((food, index) => (
                            <MenuSectionCard key={index} food={food} />
                        ))
                    ) : (
                        <div className='bg-indigo-950 w-full rounded-2xl text-white px-6 py-5 md:px-10 md:py-7 flex justify-center items-center'>
                            <p className='font-bold text-xl md:text-3xl'>No food items to show...</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export default MenuSection;
