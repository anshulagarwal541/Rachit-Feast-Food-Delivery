import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

function AddFoodCategory() {
    const { restaurant, setRestaurant, id, url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [categories, setCategories] = useState([]);

    const columns = [
        { field: 'id', headerName: 'S No', width: 200 },
        { field: 'name', headerName: 'Category', width: 200 },
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
                        onClick={(event) => handleClick(event, params.row.id)}
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
        },
    ];

    useEffect(() => {
        const data = { _id: id };
        axios.post(`${url}/admin/getRestaurant`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetCategory(response.data.categories);
            } else {
                console.log(response.data.error);
            }
        });
    }, []);

    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const transformAndSetCategory = (category) => {
        const transformedCategory = category.map((res, i) => ({
            id: i,
            name: res.name
        }));
        setCategories(transformedCategory);
    };

    const handleEdit = (id) => {
        // Add your edit logic here
    };

    const handleDelete = (id) => {
        // Add your delete logic here
    };

    const submitCategory = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('category')
        };
        axios.post(`${url}/admin/restaurant/${restaurant._id}/addCategory`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetCategory(response.data.categories);
                setError(true)
                setErrorType("success")
                setErrorMessage("Successfully added category..!!")
            } else {
                console.log(response.data.error);
            }
        });
    };

    const handleClose2 = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    return (
        <div className='h-auto flex justify-center items-center flex-col gap-5 p-4'>
            {error && (
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        open={error}
                        autoHideDuration={2000}
                        onClose={handleClose}
                        key={"top" + "center"}
                    >
                        <Alert
                            onClose={handleClose2}
                            severity={errorType}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {errorMessage}
                        </Alert>
                    </Snackbar>
                )}
            <div className='w-full max-w-xl bg-white rounded-2xl shadow-md'>
                <p className='bg-indigo-950 text-white px-3 py-2 w-[60%] text-2xl font-bold rounded-tl-full rounded-r-full'>
                    Add Category
                </p>
                <form onSubmit={submitCategory} action="POST" className='flex justify-center flex-col py-4 gap-4 px-5'>
                    <div className='flex flex-col gap-2 w-[90%] mx-auto p-2'>
                        <label htmlFor="category" className='font-bold'>Name</label>
                        <input type="text" id="category"
                            name="category" placeholder='Category: eg Breakfast'
                            className='px-4 py-2 rounded-full shadow-lg w-full' />
                    </div>
                    <button className='mx-auto w-full md:w-auto px-5 py-2 bg-indigo-950 text-white font-bold rounded-full'>
                        Add
                    </button>
                </form>
            </div>
            <div className='bg-white rounded-b-2xl border-none w-full max-w-2xl' style={{ height: 300, width: '100%' }}>
                <DataGrid
                    rows={categories}
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

export default AddFoodCategory;
