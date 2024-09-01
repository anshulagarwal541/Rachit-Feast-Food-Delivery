import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import { pizza } from '../../../public';
import { AuthContext } from '../../Helpers/AuthContext';

function Restaurants() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext)
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);

    const columns = [
        {
            field: 'image',
            headerName: 'Image',
            width: 80,
            renderCell: (params) => (
                <div className='flex justify-start items-center h-full'>
                    <img className='w-[2rem] h-[2rem] rounded-full border-2 border-indigo-950' src={params.row.image} alt="" />
                </div>
            ),
        },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'address', headerName: 'Address', width: 200 },
        { field: 'vendor', headerName: 'Vendor', width: 200 },
        {
            field: 'status',
            headerName: 'Status',
            width: 200,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => handleButtonClick(e, params.row.id)}
                    sx={{
                        border: "50%",
                        backgroundColor: "indigo",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        paddingY: "2px",
                        fontSize: "0.5rem"
                    }}
                >
                    {params.row.status}
                </Button>
            ),
        },
    ];

    useEffect(() => {
        axios.get(`${url}/admin/allRestaurants`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetRestaurant(response.data)
            }
            else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        })
    }, [])

    const handleButtonClick = (event, id) => {
        event.stopPropagation();
        let rows = restaurants;
        rows.map((row) => {
            if (row.id === id) {
                const data = {
                    status: row.status,
                    id: id
                }
                axios.post(`${url}/admin/restaurants/updateStatus`, data, {
                    headers: {
                        adminAccessToken: localStorage.getItem("adminAccessToken")
                    }
                }).then((response) => {
                    if (response.data.error) {
                        setError(true)
                        setErrorType("error")
                        setErrorMessage(response.data.error);
                    }
                    else {
                        transformAndSetRestaurant(response.data)
                        navigate("/admin/restaurants")
                    }
                })
            }
        });
    };

    const handleRowClick = (e) => {
        navigate(`/restaurant/${e.id}`)
    }

    const transformAndSetRestaurant = (restaurant) => {
        const transformedRestaurant = restaurant.map((res) => ({
            id: res._id,
            image: pizza, // Ensure image is included if available
            name: res.name,
            address: res.address,
            vendor: res.vendor.email,
            status: res.status
        }));
        setRestaurants(transformedRestaurant);
    }

    return (
        <div className='flex justify-center items-center h-[100vh] px-2 md:px-5'>
            <div className='bg-white rounded-2xl w-full lg:w-[90%] mx-auto'>
                <div className='flex justify-between px-5 py-3'>
                    <p className='font-bold'>Restaurants</p>
                    <form action="POST">
                        <input
                            type="text"
                            name="search"
                            className='px-5 py-1 shadow-xl rounded-full w-full sm:w-auto'
                            placeholder='search'
                        />
                    </form>
                </div>
                <div
                    className='bg-white rounded-b-2xl border-none w-full flex items-center'
                    style={{ height: 'calc(100vh - 200px)', width: '100%' }} // Responsive height calculation
                >
                    <DataGrid
                        rows={restaurants}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection={false}
                        onRowClick={handleRowClick}
                        sx={{
                            border: "none",
                            width: '100%', // Use full width
                            height: '100%'  // Use full height
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Restaurants;
