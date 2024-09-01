import React, { useContext, useState } from 'react'
import { home, management } from '.'
import { foodDeliveryLogo } from '../../../../public'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../Helpers/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function RestaurantSideBar() {
    const [selectedIcon, setSelectedIcon] = useState("Dashboard");
    const { id } = useContext(AuthContext);
    const handleClick = (icon) => {
        setSelectedIcon(icon)
    }

    return (
        <aside className='hidden text-center py-3 h-full bg-white rounded-tr-3xl rounded-br-3xl px-5 md:flex flex-col gap-5'>
            <div className='flex gap-4 items-center'>
                <img src={foodDeliveryLogo} alt="" className=' border border-1 border-black w-[3rem] h-[3rem] rounded-full' />
                <p className='text-2xl font-bold'>RachitFeast</p>
            </div>
            {home.map((val, i) => {
                return (
                    < Link key={i} to={`/restaurant/${id}/${val.to}`} onClick={() => handleClick(val.name)} className={`${selectedIcon === val.name ? "bg-indigo-950 text-white" : "bg-slate-100 text-black"} flex gap-3 rounded-3xl py-1 px-2 hover:bg-indigo-950 hover:text-white`}>
                        <val.icon />
                        {val.name}
                    </Link>
                )
            })}
            <div className='flex flex-col gap-5'>
                <p className='font-bold text-start'>MANAGEMENT</p>
                {management.map((val, i) => {
                    return (
                        <Link key={i} to={`/restaurant/${id}/${val.to}`} onClick={() => handleClick(val.name)} className={`${selectedIcon === val.name ? "bg-indigo-950 text-white" : "bg-slate-100 text-black"} flex gap-1 rounded-3xl py-1 px-2 hover:bg-indigo-950 hover:text-white`}>
                            <val.icon />
                            {val.name}
                        </Link>
                    )
                })}
                <Link to="/admin" onClick={() => handleClick("Back to Admin")} className={`${selectedIcon === "Back to Admin" ? "bg-indigo-950 text-white" : "bg-slate-100 text-black"} flex gap-1 rounded-3xl py-1 px-2 hover:bg-indigo-950 hover:text-white`}>
                    <ArrowBackIcon />
                    Back to Admin
                </Link>
            </div>
        </aside >
    )
}

export default RestaurantSideBar