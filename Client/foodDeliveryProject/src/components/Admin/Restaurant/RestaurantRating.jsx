import React, { useContext, useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { AuthContext } from '../../../Helpers/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";


function RestaurantRating() {
  const { url } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [ratings, setRatings] = useState([]);

  const columns = [
    { field: 'orderNo', headerName: 'OrderNo', width: 230 },
    { field: 'date', headerName: 'Date', width: 230 },
    { field: 'user', headerName: 'User', width: 230 },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 230,
      renderCell: (params) => (
        <ReactStars
          count={5}
          value={params.row.rating}
          edit={false}
          size={24}
          activeColor="#d62727"
        />
      ),
    }
  ];

  useEffect(() => {
    const data = {
      _id: id
    }
    axios.post(`${url}/admin/getRestaurant`, data, {
      headers: {
          adminAccessToken: localStorage.getItem("adminAccessToken")
      }
  }).then((response) => {
      if (!response.data.error) {
        transformAndSetRating(response.data.orders);
      }
      else {
        console.log(response.data);
      }
    })
  }, [])


  const transformAndSetRating = (rating) => {
    if (rating) {
      const transformedRating = rating.map((res) => ({
          id: res._id,
          user: res.user.name,
          rating: res.restaurantRating.rating,
          date: res.orderTime,
          orderNo: res.orderNo
        }
      ));
      setRatings(transformedRating);
    }
  }


  return (
    <div className='bg-white rounded-2xl w-[95%] mx-auto my-10'>
      <div
        className='bg-white rounded-b-2xl border-none w-full p-5'
        style={{ height: 300, width: '100%' }}
      >
        <DataGrid
          rows={ratings}
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
            width: "100%"
          }}
        />
      </div>
    </div>
  )
}

export default RestaurantRating