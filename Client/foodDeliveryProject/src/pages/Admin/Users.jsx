import React, { useState, useEffect, useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';


function Users() {
    const { url } = useContext(AuthContext)
    const [users, setUsers] = useState([]);
    const columns = [
        { field: 'name', headerName: 'Name', width: 430 },
        { field: 'email', headerName: 'Email', width: 430 },
        { field: 'phone', headerName: 'Total Restaurant', width: 430 },
    ];
    useEffect(() => {
        axios.get(`${url}/admin/getUsers`, {
            headers: {
                adminAccessToken: localStorage.getItem("adminAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                transformAndSetUser(response.data);
            }
            else {
                console.log(response.data.error);
            }
        })
    }, [])

    const transformAndSetUser = (user) => {
        const transformedUser = user.map((res) => ({
            id: res._id,
            name: res.name,
            email: res.email,
            phone: res.phone
        }));
        setUsers(transformedUser);
    }

    return (
        <div className='flex justify-center items-center h-[100vh]'>
            <div className='bg-white rounded-2xl w-[90%] mx-auto'>
                <div className='flex justify-between px-5 py-3'>
                    <p className='font-bold'>Users</p>
                    <form action="POST">
                        <input type="text" name="search" className='px-5 py-1 shadow-xl rounded-full' placeholder='search' />
                    </form>
                </div>
                <div
                    className='bg-white rounded-b-2xl border-none w-full'
                    style={{ height: 300, width: '100%' }}>
                    <DataGrid
                        rows={users}
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
        </div>
    )
}

export default Users