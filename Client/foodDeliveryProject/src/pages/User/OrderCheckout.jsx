import UserHeader from '../../components/User/UserHeader'
import React, { useState, useEffect, useContext } from 'react'
import ReactMapGL, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';
import { foodDeliveryLogo } from '../../../public';
import BillList from './BillList';
import BillInfo from './BillInfo';
import { useNavigate, useParams } from 'react-router-dom';
import MapBox from './MapBox';
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

function OrderCheckout() {
    const { id } = useParams();
    const { url, restaurant, setRestaurant, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [viewPort, setViewPort] = useState({
        latitude: 28.7041,
        longitude: 77.1025,
        zoom: 12,
        bearing: 0,
        pitch: 0
    });
    const [selected, setSelected] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);
    const [bill, setBill] = useState(null);
    const [addAddress, setAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState(null);
    const navigate = useNavigate();
    const [isAddressChanged, setIsAddressChanged] = useState(false);
    const [user, setUser] = useState(null);
    const [isTipSelected, setIsTipSelected] = useState(false)
    const [tip, setTip] = useState(null)
    const [isPaymentPossible, setIsPaymentPossible] = useState(false)
    const [finalOrderForDelivery, setFinalOrderForDelivery] = useState(null);

    const haversineDistance = (restaurantCoords, userCoords) => {
        const toRadians = (degrees) => degrees * (Math.PI / 180);

        const lat1 = toRadians(restaurantCoords.latitude);
        const lon1 = toRadians(restaurantCoords.longitude);
        const lat2 = toRadians(userCoords.latitude);
        const lon2 = toRadians(userCoords.longitude);

        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;

        const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const R = 6371; // Radius of the Earth in kilometers
        const result = R * c;   // Distance in kilometers
        if (result <= restaurantCoords.deliveryCircle) {
            setIsPaymentPossible(true)
        }
        else {
            setIsPaymentPossible(false)
        }
    }

    useEffect(() => {
        axios.get(`${url}/home/restaurant/${id}`).then((response) => {
            if (!response.data.error) {
                setRestaurant(response.data);
                setViewPort({
                    latitude: response.data.latitude,
                    longitude: response.data.longitude,
                    zoom: 15,
                    bearing: 0,
                    pitch: 0
                });
            } else {
                console.log(response.data.error);
            }
        });

        axios.get(`${url}/user/getBill`, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setBill(response.data.foods);
            } else {
                console.log(response.data.error);
            }
        });

        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        setCurrentDate(`${formattedDate} | ${formattedTime}`);
    }, []);

    useEffect(() => {
        if (restaurant && user && user.address) {
            haversineDistance(restaurant, user.address)
        }
    }, [newAddress])

    const handleAddAddress = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            address: formData.get("address")
        };
        axios.post(`${url}/user/address`, data, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setNewAddress(response.data.name);
                setIsAddressChanged(!isAddressChanged);
                setAddAddress(false);
                setError(true)
                setErrorType("success")
                setErrorMessage("Successfully added address")
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error);
            }
        });
    };

    const circleCoordinates = restaurant ? createCircle({ latitude: restaurant.latitude, longitude: restaurant.longitude }, restaurant.deliveryCircle) : [];

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
            <div className='relative pb-1 bg-yellow-400'>
                <ReactMapGL
                    {...viewPort}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    style={{
                        width: "100%",
                        height: '50vh', // Responsive height
                    }}
                    mapStyle='mapbox://styles/mapbox/navigation-day-v1'
                    onMove={event => setViewPort(event.viewState)}
                    scrollZoom={false}
                    setFog={true}
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
            <div className='relative w-full max-w-6xl h-fit py-10 flex flex-col gap-5 mx-auto px-4'>
                <div className='w-full mx-auto rounded-2xl px-5 py-2 bg-indigo-950 text-white font-bold flex gap-4 md:gap-10 items-center'>
                    <img src={foodDeliveryLogo} alt="" className='w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full' />
                    <div className='flex flex-col gap-1'>
                        <p className='text-lg md:text-xl'>Order Time :</p>
                        <p className='text-xl md:text-2xl'>{currentDate}</p>
                    </div>
                </div>
                <div className='w-full gap-5 flex flex-col md:flex-row justify-evenly'>
                    <AuthContext.Provider value={{
                        tip, setTip,
                        isTipSelected, setIsTipSelected,
                        user, setUser,
                        isAddressChanged,
                        setNewAddress, newAddress,
                        addAddress, setAddAddress,
                        url,
                        id,
                        bill, setBill,
                        restaurant, setRestaurant,
                        isPaymentPossible, setIsPaymentPossible,
                        haversineDistance,
                        finalOrderForDelivery, setFinalOrderForDelivery,
                        currentDate, error, setError,
                        errorMessage, setErrorMessage,
                        errorType, setErrorType
                    }}>
                        <BillList />
                        <BillInfo />
                    </AuthContext.Provider>
                </div>
            </div>
            {addAddress && (
                <div className='fixed top-0 left-0 w-full h-full z-50 backdrop-blur-md flex items-center justify-center'>
                    <AuthContext.Provider value={{
                        setNewAddress, newAddress, error, setError,
                        errorMessage, setErrorMessage,
                        errorType, setErrorType
                    }}>
                        <div className='bg-indigo-950 text-white flex flex-col gap-5 rounded-lg shadow-lg p-6 w-full max-w-md m-5'>
                            <MapBox url={url} width="100%" height="200px" />
                            <form onSubmit={handleAddAddress} action="POST" className='flex flex-col gap-4'>
                                <label htmlFor="address" className='text-xl font-bold'>Add Address :</label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    onChange={(e) => setNewAddress(e.target.value)}
                                    value={newAddress ? newAddress : ""}
                                    placeholder='Full address'
                                    className='border-2 text-black border-yellow-400 w-full rounded-lg px-4 py-2'
                                />
                                <button className='bg-white px-4 py-2 font-bold text-indigo-950 rounded-lg'>Add</button>
                            </form>
                            <button onClick={() => setAddAddress(false)} className='bg-white px-4 py-2 font-bold text-indigo-950 rounded-lg'>Cancel</button>
                        </div>
                    </AuthContext.Provider>
                </div>
            )}
        </div>
    )
}

export default OrderCheckout;
