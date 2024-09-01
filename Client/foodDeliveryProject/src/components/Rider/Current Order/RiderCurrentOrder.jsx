import React, { useState, useEffect, useContext, useRef } from 'react';
import ReactMapGL, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { AuthContext } from '../../../Helpers/AuthContext';
import { foodDeliveryLogo } from '../../../../public';
import { useNavigate } from 'react-router-dom';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import RiderHeader from '../../../pages/Rider/Header/RiderHeader';
import RiderBillList from './RiderBillList';
import RiderBillInfo from './RiderBillInfo';

function createCircle(center, radiusInKm, points = 64) {
  const coordinates = [];
  for (let i = 0; i < points; i++) {
    const angle = (i * 360) / points;
    const latitude = center.latitude + (radiusInKm / 110.574) * Math.cos((angle * Math.PI) / 180);
    const longitude = center.longitude + (radiusInKm / (111.32 * Math.cos((center.latitude * Math.PI) / 180))) * Math.sin((angle * Math.PI) / 180);
    coordinates.push([longitude, latitude]);
  }
  coordinates.push(coordinates[0]);
  return coordinates;
}

function RiderCurrentOrder() {
  const { url } = useContext(AuthContext);
  const [restaurant, setRestaurant] = useState(null);
  const [viewPort, setViewPort] = useState({
    latitude: 28.7041,
    longitude: 77.1025,
    zoom: 12,
    bearing: 0,
    pitch: 0
  });
  const [currentDate, setCurrentDate] = useState(null);
  const [bill, setBill] = useState(null);
  const [addAddress, setAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isPaymentPossible, setIsPaymentPossible] = useState(false);
  const [order, setOrder] = useState(null);
  const [rider, setRider] = useState(null)

  const mapRef = useRef(null);

  useEffect(() => {
    axios.get(`${url}/rider/order/ongoing`, {
      headers: {
        riderAccessToken: localStorage.getItem("riderAccessToken")
      }
    }).then((response) => {
      if (response.data == null) {
        setOrder(response.data);
      }
      else {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          setRestaurant(response.data.restaurant);
          setViewPort({
            latitude: response.data.restaurant.latitude,
            longitude: response.data.restaurant.longitude,
            zoom: 15,
            bearing: 0,
            pitch: 0
          });
          setBill(response.data.items);
          setCurrentDate(response.data.orderTime);
          setUser(response.data.user);
          setRider(response.data.rider)
          setOrder(response.data);
        }
      }
    });
  }, [url]);

  const circleCoordinates = restaurant ? createCircle({ latitude: restaurant.latitude, longitude: restaurant.longitude }, restaurant.deliveryCircle) : [];

  useEffect(() => {
    if (rider && mapRef.current && restaurant && user) {
      const map = mapRef.current.getMap();

      const directions = new MapboxDirections({
        accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
        unit: 'metric',
        profile: 'mapbox/driving',
      });

      directions.setOrigin([restaurant.longitude, restaurant.latitude]);
      directions.setDestination([user.address.longitude, user.address.latitude]);

      map.addControl(directions, 'top-left');
    }
  }, [restaurant, user]);

  return (
    <div className='relative bg-indigo-50 min-h-screen'>
      <RiderHeader />
      {order ?
        (
          <>
            <div className='relative pb-1 bg-yellow-400'>
              <ReactMapGL
                {...viewPort}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                style={{
                  width: "100%",
                  height: '50vh' // Adjusted to a responsive height
                }}
                mapStyle='mapbox://styles/mapbox/navigation-day-v1'
                onMove={event => setViewPort(event.viewState)}
                scrollZoom={false}
                ref={mapRef}
              >
                {restaurant && (
                  <>
                    <Marker
                      latitude={restaurant.latitude}
                      longitude={restaurant.longitude}
                    >
                      <div className='bg-blue-500 p-2 rounded-full'></div>
                    </Marker>
                    <Source id="circle" type="geojson" data={{
                      type: "Feature",
                      geometry: {
                        type: "Polygon",
                        coordinates: [circleCoordinates]
                      }
                    }}>
                      <Layer
                        id="circle-fill"
                        type="fill"
                        paint={{
                          "fill-color": rider ? "#24a9be" : "#2F085F",
                          "fill-opacity": 0.5
                        }}
                      />
                    </Source>
                  </>
                )}
                {user && user.address.name !== "" && (
                  <Marker
                    latitude={user.address.latitude}
                    longitude={user.address.longitude}
                  >
                    <div className='bg-red-600 p-2 rounded-full'></div>
                  </Marker>
                )}
                <NavigationControl style={{ marginRight: "10px" }} />
              </ReactMapGL>
            </div>
            <div className='relative w-full max-w-screen-lg py-10 px-4 mx-auto flex flex-col gap-5'>
              <div className='w-full rounded-2xl px-5 py-2 bg-indigo-950 text-white font-bold flex flex-col gap-3 items-center sm:flex-row sm:justify-between'>
                <img src={foodDeliveryLogo} alt="Food Delivery Logo" className='w-20 h-20 rounded-full' />
                <div className='text-center sm:text-left'>
                  <p className='text-xl'>Order Time:</p>
                  <p className='text-2xl'>{currentDate}</p>
                </div>
              </div>
              <div className='w-full flex flex-col gap-5 sm:flex-row sm:gap-10'>
                <AuthContext.Provider value={{
                  user, setUser,
                  setNewAddress, newAddress,
                  addAddress, setAddAddress,
                  url,
                  bill, setBill,
                  restaurant, setRestaurant,
                  order
                }}>
                  <RiderBillList />
                  <RiderBillInfo />
                </AuthContext.Provider>
              </div>
            </div>
            {addAddress && (
              <div className='fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center'>
                <AuthContext.Provider value={{ setNewAddress, newAddress }}>
                  <div className='p-6 bg-indigo-950 text-white rounded-lg w-full max-w-md'>
                    <MapBox url={url} width="100%" height="200px" />
                    <form onSubmit={handleAddAddress} action="POST" className='flex flex-col gap-5 mt-4'>
                      <label htmlFor="address" className='text-2xl font-bold'>Add Address:</label>
                      <input type="text"
                        name="address"
                        id="address"
                        onChange={(e) => setNewAddress(e.target.value)}
                        value={newAddress ? newAddress : ""}
                        placeholder='full address'
                        className='border-2 text-black border-yellow-400 w-full rounded-2xl px-5 py-2'
                      />
                      <button className='bg-white px-5 py-2 font-bold text-indigo-950'>Add</button>
                    </form>
                    <button onClick={() => setAddAddress(false)} className='bg-white px-5 py-2 font-bold text-indigo-950 mt-4'>Cancel</button>
                  </div>
                </AuthContext.Provider>
              </div>
            )}
          </>
        )
        :
        (
          <p className='h-[100vh] w-full flex justify-center items-center font-bold text-3xl text-indigo-950'>No Current Order yet ..</p>
        )
      }
    </div>
  );
}

export default RiderCurrentOrder;
