import React, { useState } from 'react';
import { foodDeliveryLogo } from '../../../../public/index.js';
import { Link } from 'react-router-dom';
import { home, management, general } from './index.js';

function SideBar() {
  const [selectedIcon, setSelectedIcon] = useState("Home");

  const handleClick = (icon) => {
    setSelectedIcon(icon);
  };

  return (
    // Use md:block to show the sidebar on medium and larger screens, hidden by default
    <aside className='hidden text-center py-3 h-full bg-white rounded-tr-3xl rounded-br-3xl px-5 md:flex flex-col gap-5'>
      <div className='flex gap-4 items-center'>
        <img src={foodDeliveryLogo} alt="Food Delivery Logo" className='border border-1 border-black w-[3rem] h-[3rem] rounded-full' />
        <p className='text-2xl font-bold'>RachitFeast</p>
      </div>
      
      {/* Home Section */}
      {home.map((val, i) => (
        <Link
          key={i}
          to={val.to}
          onClick={() => handleClick(val.name)}
          className={`${selectedIcon === val.name ? "bg-indigo-950 text-white" : "bg-slate-100 text-black"} flex gap-3 rounded-3xl py-1 px-2 hover:bg-indigo-950 hover:text-white`}
        >
          <val.icon />
          {val.name}
        </Link>
      ))}

      {/* General Section */}
      <div className='flex flex-col gap-3'>
        <p className='font-bold text-start'>GENERAL</p>
        {general.map((val, i) => (
          <Link
            key={i}
            to={val.to}
            onClick={() => handleClick(val.name)}
            className={`${selectedIcon === val.name ? "bg-indigo-950 text-white" : "bg-slate-100 text-black"} flex gap-1 rounded-3xl py-1 px-2 hover:bg-indigo-950 hover:text-white`}
          >
            <val.icon />
            {val.name}
          </Link>
        ))}
      </div>

      {/* Management Section */}
      <div className='flex flex-col gap-3'>
        <p className='font-bold text-start'>MANAGEMENT</p>
        {management.map((val, i) => (
          <Link
            key={i}
            to={val.to}
            onClick={() => handleClick(val.name)}
            className={`${selectedIcon === val.name ? "bg-indigo-950 text-white" : "bg-slate-100 text-black"} flex gap-1 rounded-3xl py-1 px-2 hover:bg-indigo-950 hover:text-white`}
          >
            <val.icon />
            {val.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default SideBar;
