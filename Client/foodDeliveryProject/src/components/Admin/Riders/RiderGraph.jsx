import React, { useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';
import { AuthContext } from '../../../Helpers/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RiderGraph() {
    const navigate = useNavigate();
    const { riders, setRiders, transformAndSetRider, url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const columns = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'password', headerName: 'Password', width: 150 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        {
            field: 'status',
            headerName: 'Availability',
            width: 150,
            renderCell: (params) => (
                <Switch
                    checked={params.row.status === 'available'}
                    onChange={(e) => handleActionChange(e, params.row.id)}
                />
            ),
        },
    ];

    const handleActionChange = (event, id) => {
        event.stopPropagation();
        const data = {
            id: id
        }
        axios.post(`${url}/admin/updateRider`, data, {
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
                transformAndSetRider(response.data);
                setError(true)
                setErrorType("info")
                setErrorMessage("Updated the availability of the rider..!! :)")
                navigate("/admin/riders")
            }
        })
    }

    return (
        <div className='bg-white rounded-2xl w-full lg:w-[90%] mx-auto'>
            <div className='flex flex-col lg:flex-row justify-between px-5 py-3'>
                <p className='font-bold text-lg lg:text-xl'>Riders</p>
                <form action="POST" className='mt-2 lg:mt-0'>
                    <input type="text" name="search" className='px-3 py-1 shadow-md rounded-full w-full lg:w-72' placeholder='Search' />
                </form>
            </div>
            <div
                className='bg-white rounded-b-2xl border-none w-full'
                style={{ height: 'auto', width: '100%' }}
            >
                <DataGrid
                    rows={riders}
                    columns={columns}
                    autoHeight
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
                            minHeight: '60px',
                            lineHeight: 'unset !important',
                        },
                        '& .MuiDataGrid-row': {
                            minHeight: '60px',
                        },
                    }}
                />
            </div>
        </div>
    )
}

export default RiderGraph;
