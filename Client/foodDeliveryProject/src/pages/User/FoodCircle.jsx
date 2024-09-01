import React, { useContext } from 'react';
import { FoodItems } from '../../components/User/HomePage';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Helpers/AuthContext';

function FoodCircle() {
  const { error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleClickCircle = (food) => {
    console.log(food);
    navigate(`/user/${food}`);
  };

  return (
    <div className='flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 w-full py-5'>
      {FoodItems.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => handleClickCircle(item.item)}
            className='cursor-pointer flex flex-col items-center justify-center gap-2'>
            <div>
              <img
                className='w-[6rem] h-[6rem] md:w-[8rem] md:h-[8rem] lg:w-[10rem] lg:h-[10rem] rounded-full border-4 border-indigo-950'
                src={item.image}
                alt={item.item}
              />
            </div>
            <p className='font-bold text-lg md:text-xl lg:text-2xl'>{item.item}</p>
          </div>
        );
      })}
    </div>
  );
}

export default FoodCircle;
