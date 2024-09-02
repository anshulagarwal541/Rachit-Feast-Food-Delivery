import React, { useContext, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CouponsTable() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { url, coupons, setCoupons, transformAndSetCoupon, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const columns = [
        { field: 'title', headerName: 'Title', width: 330 },
        { field: 'discount', headerName: 'Discount', width: 230 },
        {
            field: 'status',
            headerName: 'Status',
            width: 230,
            renderCell: (params) => (
                <Switch
                    checked={params.row.status === 'available'}
                    onChange={(e) => handleActionChange(e, params.row.id)}
                />
            ),
        },
        {
            headerName: 'Action',
            width: 230,
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

    const handleActionChange = (event, id) => {
        event.stopPropagation();
        const data = { id: id };
        axios.post(`${url}/admin/updateCouponStatus`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken"),
            },
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetCoupon(response.data);
                setError(true)
                setErrorType("info")
                setErrorMessage("Coupon Status updated..!!")
                navigate('/admin/coupons');
            } else {
                console.log(response.data.error);
            }
        });
    };

    const handleDelete = (id) => {
        const data = { id: id };
        axios.post(`${url}/admin/deleteCoupon`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken"),
            },
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetCoupon(response.data);
                navigate('/admin/coupons');
            } else {
                console.log(response.data.error);
            }
        });
    };

    return (
        <div className='bg-white rounded-2xl w-full max-w-5xl mx-auto p-4'>
            <div className='flex flex-col md:flex-row justify-between items-center px-5 py-3 gap-3'>
                <p className='font-bold text-lg'>Coupons</p>
                <form action="POST" className='w-full md:w-auto'>
                    <input
                        type="text"
                        name="search"
                        className='px-5 py-1 w-full md:w-auto shadow-xl rounded-full'
                        placeholder='Search'
                    />
                </form>
            </div>
            <div className='bg-white rounded-b-2xl w-full' style={{ height: 'auto', minHeight: 300 }}>
                <DataGrid
                    rows={coupons}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection={false}
                    sx={{
                        border: 'none',
                        width: '100%',
                    }}
                />
            </div>
        </div>
    );
}

export default CouponsTable;
