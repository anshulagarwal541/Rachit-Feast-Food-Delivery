// import React, { useContext, useState, useEffect } from 'react'
// import { DataGrid } from '@mui/x-data-grid';
// import { Button } from '@mui/material';
// import { AuthContext } from '../../../Helpers/AuthContext';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import ReactStars from "react-rating-stars-component";


// function RestaurantOrders() {
//   const { id } = useParams();
//   const { url } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const [orders, setOrders] = useState([])
//   const columns = [
//     { field: 'orderNo', headerName: 'Order No', width: 230 },
//     { field: 'date', headerName: 'Date', width: 230 },
//     {
//       field: 'status',
//       headerName: 'Status',
//       width: 230,
//       renderCell: (params) => {
//         const status = params.row.status;
//         // Check if the status is either "pending" or "delivery partner assigned"
//         if (status === "pending" || status === "delivery partner assigned") {
//           return (
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={(e) => handleButtonClick(e, params.row.id)}
//               sx={{
//                 border: "50%",
//                 backgroundColor: "indigo",
//                 borderRadius: "20px",
//                 fontWeight: "bold",
//                 paddingY: "2px",
//                 fontSize: "0.5rem"
//               }}
//             >
//               {status}
//             </Button>
//           );
//         } else {
//           // Display plain text for other statuses
//           return <span>{status}</span>;
//         }
//       }
//     },
//     { field: 'user', headerName: 'Customer Name', width: 230 },
//     { field: 'items', headerName: 'Total Items', width: 230 },
//     { field: 'payment', headerName: 'Payment Mode', width: 230 },
//     { field: 'rider', headerName: 'Rider\'s name', width: 230 },
//     {
//       field: 'userRating',
//       headerName: 'User Rating',
//       width: 230,
//       renderCell: (params) => (
//         <ReactStars
//           count={5}
//           value={params.row.userRating}
//           edit={false}
//           size={24}
//           activeColor="#d62727"
//         />
//       ),
//     },
//     { field: 'amount', headerName: 'Total Amount', width: 230 },
//     { field: 'tax', headerName: 'Tax', width: 230 },
//     { field: 'tip', headerName: 'Tip', width: 230 },
//     { field: 'couponName', headerName: 'Coupon Used', width: 230 },
//     { field: 'discount', headerName: 'Discount', width: 230 }
//   ];

//   useEffect(() => {
//     const data = {
//       _id: id
//     }
//     axios.post(`${url}/admin/getRestaurant`, data, {
//       headers: {
//         adminAccessToken: localStorage.getItem("adminAccessToken")
//       }
//     }).then((response) => {
//       if (response.data.error) {
//         console.log(response.data.error);
//       }
//       else {
//         transformAndSetOrder(response.data.orders)
//       }
//     })
//   }, [])

//   const handleButtonClick = (event, id) => {
//     event.stopPropagation();
//     let rows = orders;
//     let newRows = rows.map((row) => {
//       if (row.id === id) {
//         const data = {
//           status: row.status,
//           id: id
//         }
//         axios.post(`${url}/admin/restaurants/orders/updateStatus`, data, {
//           headers: {
//             adminAccessToken: localStorage.getItem("adminAccessToken")
//           }
//         }).then((response) => {
//           if (response.data.error) {
//             console.log(response.data.error);
//           }
//           else {
//             transformAndSetOrder(response.data.orders)
//           }
//         })
//       }
//     });
//   };

//   const transformAndSetOrder = (orders) => {
//     const transformedOrders = orders.map((res) => ({
//       id: res._id,
//       orderNo: res.orderNo,
//       date: res.orderTime,
//       status: res.status,
//       user: res.user.name,
//       payment: res.paymentMode,
//       rider: res.rider ? res.rider.name : "N.A",
//       userRating: res.restaurantRating ? res.restaurantRating.rating : 0,
//       amount: res.totalAmount,
//       tax: res.tax,
//       tip: res.tip,
//       couponName: res.couponName ? res.couponName : "N.A",
//       discount: res.couponDiscount ? res.couponDiscount : 0.0,
//       items: res.items && res.items.length
//     }));
//     setOrders(transformedOrders);
//   }


//   return (
//     <div className='bg-white rounded-2xl w-[95%] mx-auto'>
//       <div
//         className='bg-white rounded-2xl border-none w-full my-10'
//         style={{ height: 300, width: '100%' }}
//       >
//         <DataGrid
//           rows={orders}
//           columns={columns}
//           initialState={{
//             pagination: {
//               paginationModel: { page: 0, pageSize: 5 },
//             },
//           }}
//           pageSizeOptions={[5, 10]}
//           checkboxSelection={false}
//           sx={{
//             border: "none",
//             width: "100%"
//           }}
//         />
//       </div>
//     </div>
//   )
// }

// export default RestaurantOrders


import React, { useContext, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";

function RestaurantOrders() {
  const { id } = useParams();
  const { url } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const columns = [
    { field: 'orderNo', headerName: 'Order No', width: 230 },
    { field: 'date', headerName: 'Date', width: 230 },
    {
      field: 'status',
      headerName: 'Status', 
      width: 230,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === "pending" || status === "delivery partner assigned") {
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
    { field: 'user', headerName: 'Customer Name', width: 230 },
    { field: 'items', headerName: 'Total Items', width: 230 },
    { field: 'payment', headerName: 'Payment Mode', width: 230 },
    { field: 'rider', headerName: 'Rider\'s name', width: 230 },
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
    { field: 'amount', headerName: 'Total Amount', width: 230 },
    { field: 'tax', headerName: 'Tax', width: 230 },
    { field: 'tip', headerName: 'Tip', width: 230 },
    { field: 'couponName', headerName: 'Coupon Used', width: 230 },
    { field: 'discount', headerName: 'Discount', width: 230 }
  ];

  useEffect(() => {
    const data = { _id: id };
    axios.post(`${url}/admin/getRestaurant`, data, {
      headers: {
        adminAccessToken: localStorage.getItem("adminAccessToken")
      }
    }).then((response) => {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        transformAndSetOrder(response.data.orders);
      }
    });
  }, []);

  const handleButtonClick = (event, id) => {
    event.stopPropagation();
    const data = { status: 'updated status', id: id };
    axios.post(`${url}/admin/restaurants/orders/updateStatus`, data, {
      headers: {
        adminAccessToken: localStorage.getItem("adminAccessToken")
      }
    }).then((response) => {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        transformAndSetOrder(response.data.orders);
      }
    });
  };

  const transformAndSetOrder = (orders) => {
    const transformedOrders = orders.map((res) => ({
      id: res._id,
      orderNo: res.orderNo,
      date: res.orderTime,
      status: res.status,
      user: res.user.name,
      payment: res.paymentMode,
      rider: res.rider ? res.rider.name : "N.A",
      userRating: res.restaurantRating ? res.restaurantRating.rating : 0,
      amount: res.totalAmount,
      tax: res.tax,
      tip: res.tip,
      couponName: res.couponName ? res.couponName : "N.A",
      discount: res.couponDiscount ? res.couponDiscount : 0.0,
      items: res.items && res.items.length
    }));
    setOrders(transformedOrders);
  };

  return (
    <div className='bg-white rounded-2xl w-[95%] mx-auto m-10'>
      <div
        className='w-full p-5'
        style={{ height: 300, width: '100%' }}
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

export default RestaurantOrders;
