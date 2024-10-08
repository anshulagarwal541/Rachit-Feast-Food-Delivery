import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Button, Snackbar } from '@mui/material';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useParams } from 'react-router-dom';

function RestaurantTiming() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);
    const [timing, setTiming] = useState([]);
    const { id } = useParams();

    const columns = [
        { field: 'day', headerName: 'DAYS', width: 130 },
        {
            field: 'timing',
            headerName: 'Timing',
            width: 600,
            renderCell: (params) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%"
                        }}
                    >
                        <TimePicker
                            value={dayjs(params.row.openTime, "hh:mm")}
                            onChange={(e) => handleOpenTiming(e, params.row.id)}
                            label="Open Timing"
                        />
                        <TimePicker
                            value={dayjs(params.row.closeTime, "hh:mm")}
                            onChange={(e) => handleCloseTiming(e, params.row.id)}
                            label="Close Timing"
                        />
                    </div>
                </LocalizationProvider>
            ),
        },
        {
            field: 'action',
            headerName: 'Status',
            width: 330,
            renderCell: (params) => (
                <div className='flex items-center h-full'>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleButtonClick(params)}
                        sx={{
                            border: "50%",
                            backgroundColor: "indigo",
                            height: "fit",
                            width: "10rem",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            paddingY: "5px",
                            fontSize: "0.7rem"
                        }}
                    >
                        {params.row.action}
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.post(`${url}/admin/getRestaurant`, { _id: id }, {
                    headers: {
                        adminAccessToken: localStorage.getItem("adminAccessToken")
                    }
                });
                if (!data.error) {
                    transformAndSetTiming(data.timing);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
            }
        };
        fetchData();
    }, []);

    const transformAndSetTiming = (timings) => {
        const transformedTiming = timings.map((res) => ({
            id: res.day,
            day: res.day,
            openTime: res.openTime,
            closeTime: res.closeTime,
            action: res.isClosed ? "closed" : "open"
        }));
        setTiming(transformedTiming);
    };

    const handleOpenTiming = (e, dayId) => {
        const newTime = `${e.$H}:${e.$m}`
        updateTiming(dayId, { openTime: newTime });
    };

    const handleCloseTiming = (e, dayId) => {
        const newTime = `${e.$H}:${e.$m}`
        updateTiming(dayId, { closeTime: newTime });
    };

    const updateTiming = (dayId, updatedValues) => {
        let t = timing;
        t = t.map(item =>
            item.id === dayId ? { ...item, ...updatedValues } : item
        );
        const data = {
            restaurantId: id,
            timing: t
        }
        axios.post(`${url}/admin/restaurant/timing`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage("Updated the timing..!!")
                transformAndSetTiming(response.data)
            }
            else {
                console.log(response.data.error);
            }
        })
    };

    const handleButtonClick = (params) => {
        const data = {
            restaurantId: id,
            day: params.row.day
        }
        axios.post(`${url}/admin/restaurant/timing/day`, data, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage("Updated the timing..!!")
                transformAndSetTiming(response.data)
            }
            else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error)
            }
        })
    };

    const handleClose = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    return (
        <div className='h-full flex justify-center items-center'>
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
            <div className='bg-white rounded-b-2xl border-none w-[90%] px-10'>
                <DataGrid
                    rows={timing}
                    columns={columns}
                    rowHeight={80}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 8 },
                        },
                    }}
                    pageSizeOptions={[7]}
                    checkboxSelection={false}
                    sx={{
                        border: "none",
                    }}
                />
            </div>
        </div>
    );
}

export default RestaurantTiming;
