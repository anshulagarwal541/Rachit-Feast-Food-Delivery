import React, { useContext, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Button, Snackbar } from '@mui/material';
import { AuthContext } from '../../Helpers/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";

function WithdrawRequest() {
  const { url, error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType } = useContext(AuthContext);
  const navigate = useNavigate();
  const [riders, setRiders] = useState([]);

  const columns = [
    { field: 'rider', headerName: 'Rider', width: 230 },
    { field: 'amount', headerName: 'Amount', width: 230 },
    {
      field: 'status',
      headerName: 'Status',
      width: 230,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === "accept") {
          return (
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
              {status}
            </Button>
          );
        } else {
          return <span>{status}</span>;
        }
      }
    },
    {
      field: 'userRating',
      headerName: 'User Rating',
      width: 230,
      renderCell: (params) => (
        <ReactStars
          count={5}
          value={params.row.userRating}
          edit={false}
          size={24}
          activeColor="#d62727"
        />
      ),
    },
  ];

  useEffect(() => {
    axios.get(`${url}/admin/allRiders`, {
      headers: {
        adminAccessToken: localStorage.getItem("adminAccessToken")
      }
    }).then((response) => {
      if (response.data.error) {
        setError(true)
        setErrorType("error")
        setErrorMessage(response.data.error);
      } else {
        transformAndSetOrder(response.data);
      }
    });
  }, []);

  const handleButtonClick = (event, id) => {
    event.stopPropagation();
    const data = {  id: id };
    axios.post(`${url}/admin/rider/withdraw/approved`, data, {
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
        setErrorMessage("Withdraw aproved..!!")
        transformAndSetOrder(response.data);
      }
    });
  };

  const transformAndSetOrder = (orders) => {
    const o = orders.filter((order) => order.withdrawRequest === true );
    const transformedOrders = o.map((res) => ({
      id: res._id,
      rider: res.name,
      amount: res.wallet,
      status: res.withdrawRequest ? "accept" : "accepted",
      userRating: res.totalRating ? res.totalRating : 0
    }));
    setRiders(transformedOrders);
  };

  const handleClose = () => {
    setError(false);
    setErrorMessage(null);
    setErrorType(null)
  };

  return (
    <div className='bg-white rounded-2xl w-[95%] mx-auto m-10'>
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
      <div
        className='w-full p-5'
        style={{ height: 300, width: '100%' }}
      >
        <DataGrid
          rows={riders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection={false}
          autoHeight
          sx={{
            border: "none",
            width: "100%",
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
            },
            '& .MuiDataGrid-cell': {
              padding: '8px',
            },
          }}
        />
      </div>
    </div>
  );
}

export default WithdrawRequest;
