import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';

function Dispatch() {
    const { url } = useContext(AuthContext);
    const navigate = useNavigate();
    const [riders, setRiders] = useState(null);
    const [orders, setOrders] = useState([]);
    const [availableRider, setAvailableRider] = useState(null);

    const columns = [
        { field: 'orderNo', headerName: 'Order.No', width: 160 },
        { field: 'restaurantName', headerName: 'Restaurant', width: 130 },
        { field: 'restaurantAddress', headerName: 'Address', width: 200 },
        { field: 'paymentMode', headerName: 'Payment', width: 130 },
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
                        fontSize: "0.7rem"
                    }}
                >
                    {params.row.status}
                </Button>
            ),
        },
        {
            field: 'rider',
            headerName: 'Rider',
            width: 180,
            renderCell: (params) => {
                return Array.isArray(params.row.riders) && params.row.riders.length > 0 ? (
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id={`select-label-${params.row.id}`}>Riders</InputLabel>
                            <Select
                                labelId={`select-label-${params.row.id}`}
                                id={`select-${params.row.id}`}
                                label="Riders"
                                onChange={(e) => handleChange(e, params.row.id)}
                            >
                                <MenuItem value={"none"}>None</MenuItem>
                                {riders && riders.map((r, i) => (
                                    <MenuItem key={i} value={r._id}>{r.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            border: "50%",
                            backgroundColor: "indigo",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            paddingY: "2px",
                            fontSize: "0.7rem"
                        }}
                    >
                        {params.row.riders}
                    </Button>
                );
            },
        },
        { field: 'orderTime', headerName: 'Order Time', width: 200 }
    ];

    useEffect(() => {
        axios.get(`${url}/admin/allRiders`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                const availableRiders = response.data.filter(rider => rider.availability === "available");
                setRiders(availableRiders);
            } else {
                console.log(response.data.error);
            }
        });
    }, []);

    useEffect(() => {
        axios.get(`${url}/admin/dispatch`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetOrder(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    }, [riders]);

    useEffect(() => {
        axios.get(`${url}/admin/allRiders`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                const availableRiders = response.data.filter(rider => rider.availability === "available");
                setRiders(availableRiders);
            } else {
                console.log(response.data.error);
            }
        });
    }, [orders]);

    const handleChange = (event, orderId) => {
        const data = {
            orderId: orderId,
            riderId: event.target.value
        };
        axios.post(`${url}/admin/dispatch/update`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetOrder(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    };

    const transformAndSetOrder = (order) => {
        const transformedOrder = order.map((res) => ({
            id: res._id,
            orderNo: res.orderNo,
            restaurantName: res.restaurant.name,
            restaurantAddress: res.restaurant.address,
            riders: res.rider ? res.rider.name : (riders && riders.length > 0 ? riders : "No Partner available"),
            paymentMode: res.paymentMode,
            status: res.status,
            orderTime: res.orderTime
        }));
        setOrders(transformedOrder);
    };

    return (
        <div className='flex justify-center items-center min-h-screen p-4'>
            <div
                className='bg-white rounded-2xl shadow-md w-full max-w-5xl flex items-center p-10'
                style={{ height: 'auto', width: '100%' }}
            >
                <DataGrid
                    rows={orders}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection={false}
                    sx={{
                        border: "none",
                        '& .MuiDataGrid-cell': {
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                        },
                        '& .MuiDataGrid-columnsContainer': {
                            backgroundColor: 'rgba(240, 240, 240, 0.8)',
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default Dispatch;
