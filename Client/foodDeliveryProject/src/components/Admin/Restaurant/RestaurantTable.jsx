import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';


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


function RestaurantTable() {
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
    return (
        <div className='bg-white rounded-2xl w-[90%] mx-auto'>
            <div className='flex justify-between px-5 py-3'>
                <p className='font-bold'>Vendors</p>
                <form action="POST">
                    <input type="text" name="search" className='px-5 py-1 shadow-xl rounded-full' placeholder='search' />
                </form>
            </div>
            <div className='bg-white rounded-b-2xl border-none w-full'>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection={false}
                    onRowClick={(e) => handleRowClick(e)}
                    sx={{
                        border: "none"
                    }}
                />
            </div>
        </div>
    )
}

export default RestaurantTable