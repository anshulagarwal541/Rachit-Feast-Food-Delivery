import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';

const columns = [
    { field: 'email', headerName: 'Email', width: 230 },
    { field: 'name', headerName: 'Name', width: 230 },
    { field: 'totalRestaurant', headerName: 'Total Restaurant', width: 230 },
    {
        field: 'action',
        headerName: 'Action',
        width: 230,
        renderCell: (params) => (
            <Switch
                checked={params.row.action === 'active'}
                onChange={(e) => handleActionChange(e, params.row.id)}
            />
        ),
    },
];

const rows = [
    { id: 1, email: "abc@gmail.com", name: 'Snow', totalRestaurant: 'Jon', action: 'active' },
    { id: 2, email: "abc@gmail.com", name: 'Lannister', totalRestaurant: 'Cersei', action: 'inactive' },
    { id: 3, email: "abc@gmail.com", name: 'Lannister', totalRestaurant: 'Jaime', action: 'active' },
    { id: 4, email: "abc@gmail.com", name: 'Stark', totalRestaurant: 'Arya', action: 'inactive' },
    { id: 5, email: "abc@gmail.com", name: 'Targaryen', totalRestaurant: 'Daenerys', action: 'active' },
    { id: 6, email: "abc@gmail.com", name: 'Melisandre', totalRestaurant: null, action: 'inactive' },
    { id: 7, email: "abc@gmail.com", name: 'Clifford', totalRestaurant: 'Ferrara', action: 'active' },
    { id: 8, email: "abc@gmail.com", name: 'Frances', totalRestaurant: 'Rossini', action: 'inactive' },
    { id: 9, email: "abc@gmail.com", name: 'Roxie', totalRestaurant: 'Harvey', action: 'active' },
];

const handleActionChange = (event, id) => {
    const newRows = rows.map((row) => {
        if (row.id === id) {
            return row.action = row.action === "active" ? "inactive" : "active"
        }
        return row;
    });
};

function RestaurantGraphFilter() {
    return (
        <div className='w-[70rem] bg-white rounded-2xl shadow-md'>
            <p className='bg-indigo-950 text-white px-3 py-2 w-[60%] text-xl rounded-r-full rounded-tl-2xl'>Graph Filter</p>
            <form action="POST" className='flex justify-center flex-col py-3'>
                <div className='flex'>
                    <div className='flex flex-col gap-3 w-1/2 p-5'>
                        <label htmlFor="startDate" className='font-bold'>Start Date</label>
                        <input type="date" id="startDate" placeholder='start date'
                            className='px-5 py-2 rounded-full shadow-black shadow-md w-[80%]' />
                    </div>
                    <div className='flex flex-col gap-3 w-1/2 p-5'>
                        <label htmlFor="endDate" className='font-bold'>End Date</label>
                        <input type="date" id="endDate" placeholder='end date'
                            className='px-5 py-2 rounded-full shadow-black shadow-md w-[80%]' />
                    </div>
                </div>
                <button className='mx-auto w-fit px-5 py-2 bg-indigo-950 text-white font-bold rounded-full'>
                    Save
                </button>
            </form>
        </div>
    )
}

export default RestaurantGraphFilter