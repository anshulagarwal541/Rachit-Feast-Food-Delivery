// import React, { useContext, useEffect, useState } from 'react'
// import { DataGrid } from '@mui/x-data-grid';
// import Switch from '@mui/material/Switch';
// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { AuthContext } from '../../../Helpers/AuthContext';
// import axios from 'axios';

// function AddFood() {
//     const { restaurant, setRestaurant, reloadPage, id, url } = useContext(AuthContext);
//     const [anchorEl, setAnchorEl] = useState(null);
//     const open = Boolean(anchorEl);
//     const [foods, setFoods] = useState([])

//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//     };

//     const columns = [
//         { field: 'id', headerName: 'S.No', width: 230 },
//         { field: 'name', headerName: 'Food Name', width: 230 },
//         { field: 'price', headerName: 'Price', width: 230 },
//         {
//             headerName: 'Action',
//             width: 230,
//             renderCell: (params) => (
//                 <div>
//                     <Button
//                         id="basic-button"
//                         aria-controls={open ? 'basic-menu' : undefined}
//                         aria-haspopup="true"
//                         aria-expanded={open ? 'true' : undefined}
//                         onClick={handleClick}
//                     >
//                         <MoreVertIcon />
//                     </Button>
//                     <Menu
//                         id="basic-menu"
//                         anchorEl={anchorEl}
//                         open={open}
//                         onClose={handleClose}
//                         MenuListProps={{
//                             'aria-labelledby': 'basic-button',
//                         }}
//                     >
//                         <MenuItem onClick={() => handleEdit(params.row.id)}>Edit</MenuItem>
//                         <MenuItem onClick={() => handleDelete(params.row.id)}>Delete</MenuItem>
//                     </Menu>
//                 </div>
//             ),
//         }
//     ];

//     useEffect(() => {
//         const data = {
//             _id: id
//         }
//         axios.post(`${url}/admin/getRestaurant`, data, {
//             headers: {
//                 adminAccessToken: localStorage.getItem("adminAccessToken")
//             }
//         }).then((response) => {
//             if (!response.data.error) {
//                 setRestaurant(response.data)
//                 transformAndSetFood(response.data.foods)
//             }
//             else {
//                 console.log(response.data.error);
//             }
//         })
//     }, [])

//     const transformAndSetFood = (food) => {
//         const transformedFood = food.map((res, i) => ({
//             id: i,
//             name: res.name,
//             price: res.price
//         }));
//         setFoods(transformedFood);
//     }

//     const handleEdit = (id) => {

//     }

//     const handleDelete = (id) => {

//     }

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         const data = {
//             name: formData.get("name"),
//             price: formData.get("price"),
//             category: formData.get("category")
//         }
//         e.target.reset();
//         axios.post(`${url}/admin/restaurant/${restaurant._id}/addFood`, data, {
//             headers: {
//                 adminAccessToken: localStorage.getItem("adminAccessToken")
//             }
//         }).then((response) => {
//             if (!response.data.error) {
//                 transformAndSetFood(response.data.foods)
//             }
//             else {
//                 console.log(response.data.error);
//             }
//         })
//     }

//     return (
//         <div className='h-[110vh] flex justify-center items-center flex-col gap-5'>
//             <div className='w-[50rem] bg-white rounded-2xl shadow-md'>
//                 <p className='bg-indigo-950 text-white px-3 py-2 w-[50%] text-2xl font-bold rounded-tl-full rounded-r-full'>Add Item</p>
//                 <form onSubmit={handleSubmit} action="POST" className='flex justify-center flex-col py-2 gap-3'>
//                     <div className='flex flex-col gap-2 w-[80%] mx-auto p-2'>
//                         <label htmlFor="username" className='font-bold'>Item Name</label>
//                         <input name="name" type="text" id="username" placeholder='name'
//                             className='px-5 py-2 rounded-full shadow-lg w-[90%]' />
//                     </div>
//                     <div className='flex flex-col gap-2 w-[80%] mx-auto p-2'>
//                         <label htmlFor="password" className='font-bold'>Item Price</label>
//                         <input name="price" type="number" id="password" placeholder='price'
//                             className='px-5 py-2 rounded-full shadow-lg w-[90%]' />
//                     </div>
//                     <div className='w-[80%] p-2 mx-auto'>
//                         <select
//                             name="category"
//                             className='w-[90%] p-2 text-center rounded-full border-2 border-indigo-950'
//                         >
//                             <option value="" default>Select Category</option>
//                             {restaurant && restaurant.categories.map((category, i) => {
//                                 return <option key={i} className='text-start' value={category.name} default>{category.name}</option>
//                             })}
//                         </select>
//                     </div>
//                     <button className='mx-auto w-fit px-5 py-2 bg-indigo-950 text-white font-bold rounded-full'>
//                         Save
//                     </button>
//                 </form>
//             </div>
//             <div
//                 className='bg-white rounded-b-2xl border-none w-[90%]'
//                 style={{ height: 300, width: '90%' }}
//             >
//                 <DataGrid
//                     rows={foods}
//                     columns={columns}
//                     initialState={{
//                         pagination: {
//                             paginationModel: { page: 0, pageSize: 5 },
//                         },
//                     }}
//                     pageSizeOptions={[5, 10]}
//                     checkboxSelection={false}
//                     onRowClick={(e) => handleRowClick(e)}
//                     sx={{
//                         border: "none"
//                     }}
//                 />
//             </div>
//         </div>
//     )
// }

// export default AddFood


import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';

function AddFood() {
    const { restaurant, setRestaurant, reloadPage, id, url } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [foods, setFoods] = useState([]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const columns = [
        { field: 'id', headerName: 'S.No', width: 150 },
        { field: 'name', headerName: 'Food Name', width: 150 },
        { field: 'price', headerName: 'Price', width: 150 },
        {
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <div>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => handleEdit(params.row.id)}>Edit</MenuItem>
                        <MenuItem onClick={() => handleDelete(params.row.id)}>Delete</MenuItem>
                    </Menu>
                </div>
            ),
        }
    ];

    useEffect(() => {
        const data = { _id: id };
        axios.post(`${url}/admin/getRestaurant`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setRestaurant(response.data);
                transformAndSetFood(response.data.foods);
            } else {
                console.log(response.data.error);
            }
        });
    }, []);

    const transformAndSetFood = (food) => {
        const transformedFood = food.map((res, i) => ({
            id: i,
            name: res.name,
            price: res.price
        }));
        setFoods(transformedFood);
    };

    const handleEdit = (id) => {
        // Add your edit logic here
    };

    const handleDelete = (id) => {
        // Add your delete logic here
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get("name"),
            price: formData.get("price"),
            category: formData.get("category")
        };
        e.target.reset();
        axios.post(`${url}/admin/restaurant/${restaurant._id}/addFood`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetFood(response.data.foods);
            } else {
                console.log(response.data.error);
            }
        });
    };

    return (
        <div className='h-auto flex justify-center items-center flex-col gap-5 p-4'>
            <div className='w-full max-w-2xl bg-white rounded-2xl shadow-md'>
                <p className='bg-indigo-950 text-white px-3 py-2 w-[60%] text-2xl font-bold rounded-tl-full rounded-r-full'>
                    Add Item
                </p>
                <form onSubmit={handleSubmit} action="POST" className='flex px-5 justify-center flex-col py-4 gap-4'>
                    <div className='flex flex-col gap-2 w-[90%] mx-auto p-2'>
                        <label htmlFor="username" className='font-bold'>Item Name</label>
                        <input name="name" type="text" id="username" placeholder='name'
                            className='px-4 py-2 rounded-full shadow-lg w-full' />
                    </div>
                    <div className='flex flex-col gap-2 w-[90%] mx-auto p-2'>
                        <label htmlFor="password" className='font-bold'>Item Price</label>
                        <input name="price" type="number" id="password" placeholder='price'
                            className='px-4 py-2 rounded-full shadow-lg w-full' />
                    </div>
                    <div className='w-[90%] p-2 mx-auto'>
                        <select
                            name="category"
                            className='w-full p-2 text-center rounded-full border-2 border-indigo-950'
                        >
                            <option value="" default>Select Category</option>
                            {restaurant && restaurant.categories.map((category, i) => {
                                return <option key={i} className='text-start' value={category.name} default>{category.name}</option>
                            })}
                        </select>
                    </div>
                    <button className='mx-auto w-full md:w-auto px-5 py-2 bg-indigo-950 text-white font-bold rounded-full'>
                        Save
                    </button>
                </form>
            </div>
            <div className='bg-white rounded-b-2xl border-none w-full max-w-2xl' style={{ height: 300, width: '100%' }}>
                <DataGrid
                    rows={foods}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection={false}
                    sx={{
                        border: "none"
                    }}
                />
            </div>
        </div>
    );
}

export default AddFood;
