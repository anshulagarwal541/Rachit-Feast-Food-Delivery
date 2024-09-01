import React, { useState, useEffect, useContext, useRef } from 'react';
import ReactMapGL, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { AuthContext } from '../../../Helpers/AuthContext';
import { foodDeliveryLogo } from '../../../../public';
import { useNavigate } from 'react-router-dom';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import UserHeader from '../UserHeader';
import MapBox from '../../../pages/User/MapBox';
import UserCurrentBillInfo from './UserCurrentBillInfo';
import UserCurrentBillList from './UserCurrentBillList';
import { Alert, Snackbar } from '@mui/material';

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

function UserCurrentOrder() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
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
    const [order, setOrder] = useState(null);

    const mapRef = useRef(null);

    useEffect(() => {
        axios.get(`${url}/user/order/current`, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
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
                    setOrder(response.data);
                }
            }
        });
    }, [url]);

    const circleCoordinates = restaurant ? createCircle({ latitude: restaurant.latitude, longitude: restaurant.longitude }, restaurant.deliveryCircle) : [];

    useEffect(() => {
        if (mapRef.current && restaurant && user) {
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

    const handleClose = () => {
        setError(false);
        setErrorMessage(null);
        setErrorType(null)
    };

    return (
        <div className='relative bg-indigo-50 min-h-screen'>
            <UserHeader />
            {error && (
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        open={error}
                        autoHideDuration={6000}
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
            {order ?
                (
                    <>
                        <div className='relative pb-1 bg-yellow-400'>
                            <ReactMapGL
                                {...viewPort}
                                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                                style={{
                                    width: "100%",
                                    height: '400px'
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
                                        />
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
                                                    "fill-color": "#2F085F",
                                                    "fill-opacity": 0.5
                                                }}
                                            />
                                        </Source>
                                    </>
                                )}
                                {user && user.address.name !== "" && (
                                    <Marker
                                        className='text-red-600'
                                        latitude={user.address.latitude}
                                        longitude={user.address.longitude}
                                    />
                                )}
                                <NavigationControl style={{ marginRight: "10px" }} />
                            </ReactMapGL>
                        </div>
                        <div className='relative px-5 w-full md:w-[80%] lg:w-[60%] mx-auto py-10 flex flex-col gap-5'>
                            <div className='w-full mx-auto rounded-2xl px-5 py-2 bg-indigo-950 text-white font-bold flex flex-col md:flex-row gap-10 items-center justify-between'>
                                <div className='flex flex-col items-center md:items-start'>
                                    <img src={foodDeliveryLogo} alt="" className='w-[5rem] h-[5rem] rounded-full' />
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-xl'>Order Time :</p>
                                        <p className='text-2xl'>{currentDate}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-end items-center md:items-end'>
                                    <p className='text-2xl'>{order && order.status.toUpperCase()}</p>
                                    <p className='text-xl py-5'>{order && order.customerCode}</p>
                                </div>
                            </div>
                            <div className='w-full flex flex-col md:flex-row gap-5 justify-evenly'>
                                <AuthContext.Provider value={{
                                    user, setUser,
                                    setNewAddress, newAddress,
                                    addAddress, setAddAddress,
                                    url,
                                    bill, setBill,
                                    restaurant, setRestaurant,
                                    order
                                }}>
                                    <UserCurrentBillList />
                                    <UserCurrentBillInfo />
                                </AuthContext.Provider>
                            </div>
                        </div>
                        {addAddress && (
                            <div className='fixed top-0 left-0 w-full h-full z-50 backdrop-blur-md flex items-center justify-center'>
                                <AuthContext.Provider value={{ setNewAddress, newAddress }}>
                                    <div className='p-5 md:p-10 bg-indigo-950 text-white flex flex-col gap-5 rounded-lg'>
                                        <MapBox url={url} width="300px" height="200px" />
                                        <form onSubmit={handleAddAddress} action="POST" className='flex flex-col gap-5'>
                                            <label htmlFor="address" className='text-xl md:text-2xl font-bold'>Add Address :</label>
                                            <input type="text"
                                                name="address"
                                                id="address"
                                                onChange={(e) => setNewAddress(e.target.value)}
                                                value={newAddress ? newAddress : ""}
                                                placeholder='Full address'
                                                className='border-2 text-black border-yellow-400 w-full rounded-2xl px-5 py-2'
                                            />
                                            <button className='bg-white px-5 py-2 font-bold text-indigo-950'>Add</button>
                                        </form>
                                        <button onClick={() => setAddAddress(false)} className='bg-white px-5 py-2 font-bold text-indigo-950'>Cancel</button>
                                    </div>
                                </AuthContext.Provider>
                            </div>
                        )}
                    </>
                )
                :
                (
                    <p className='h-screen w-full flex justify-center items-center font-bold text-3xl text-indigo-950'>No Current Order yet ..</p>
                )
            }
        </div>
    );
}

export default UserCurrentOrder;
