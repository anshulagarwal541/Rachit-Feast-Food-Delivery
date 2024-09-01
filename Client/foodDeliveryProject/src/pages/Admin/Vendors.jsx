import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';

function Vendors() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext)
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const columns = [
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'totalRestaurants', headerName: 'Total Restaurant', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => handleButtonClick(e, params)}
                    sx={{
                        border: "50%",
                        backgroundColor: "indigo",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        paddingY: "2px",
                        fontSize: "0.5rem"
                    }}
                >
                    Restaurant
                </Button>
            )
        }
    ];

    useEffect(() => {
        axios.get(`${url}/admin/vendor`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetVendors(response.data);
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
    }, []);

    const handleButtonClick = (e, params) => {
        e.stopPropagation();
        navigate(`/admin/vendor/${params.row.id}/addRestaurant`);
    };

    const postVendors = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        axios.post(`${url}/admin/vendor/post`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (response.data.error) {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            } else {
                setError(true)
                setErrorType("success")
                setErrorMessage("Successfully added the vender..!! :)")
                transformAndSetVendors(response.data);
            }
        });
        e.target.reset();
    };

    const transformAndSetVendors = (vendors) => {
        const transformedVendors = vendors.map((vendor) => ({
            id: vendor._id,
            email: vendor.email,
            totalRestaurants: vendor.restaurants.length
        }));
        setVendors(transformedVendors);
    };

    const handleClose = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    return (
        <div className='h-auto min-h-screen flex flex-col justify-center items-center gap-5 px-4 md:px-8 lg:px-16 py-10'>
            {error && (
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={error}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    key={"top" + "center"}
                >
                    <Alert
                        onClose={handleClose}
                        severity={errorType}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
            <div className='bg-white rounded-2xl w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl flex flex-col gap-5 pb-5'>
                <p className='bg-indigo-950 text-white font-bold rounded-tl-2xl py-3 text-xl px-10 w-fit md:w-[40%] rounded-r-full'>
                    Add Vendor
                </p>
                <form onSubmit={postVendors} action="POST" className='flex flex-col px-5 justify-center items-center gap-5'>
                    <div className='flex flex-col w-full md:w-[70%] mx-auto'>
                        <label htmlFor="email">Email</label>
                        <input className='rounded-full py-2 px-4 md:px-10 w-full shadow-xl border border-1 border-black' type="email" placeholder='Email' name="email" />
                    </div>
                    <div className='flex flex-col w-full md:w-[70%] mx-auto'>
                        <label htmlFor="password">Password</label>
                        <input className='rounded-full py-2 px-4 md:px-10 w-full shadow-xl border border-1 border-black' type="password" placeholder='Password' name="password" />
                    </div>
                    <button type="submit" className='bg-indigo-950 w-fit text-white font-bold px-5 py-2 rounded-full'>
                        Save
                    </button>
                </form>
            </div>
            <div className='bg-white rounded-2xl w-full max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto'>
                <div className='flex justify-between px-5 py-3'>
                    <p className='font-bold'>Vendors</p>
                    <form action="POST">
                        <input type="text" name="search" className='px-5 py-1 shadow-xl rounded-full' placeholder='search' />
                    </form>
                </div>
                <div className='w-full h-[300px] md:h-[400px]'>
                    <DataGrid
                        rows={vendors}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection={false}
                        disableColumnMenu={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default Vendors;
