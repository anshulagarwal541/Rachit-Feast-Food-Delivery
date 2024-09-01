import React, { useContext, useEffect, useState } from 'react'
import ReactMapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';

function MapBox({ width, height, url }) {
    const { setNewAddress, newAddress } = useContext(AuthContext)
    const [viewPort, setViewPort] = useState({
        latitude: 28.7041,
        longitude: 77.1025,
        zoom: 12,
        bearing: 0,
        pitch: 0
    })
    const [userAddress, setUserAddress] = useState(null)
    const [markerPosition, setMarkerPosition] = useState({ latitude: 28.7041, longitude: 77.1025 });

    useEffect(() => {
        axios.get(`${url}/user/details`, {
            headers: {
                userAccessToken: localStorage.getItem("userAccessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setUserAddress(response.data.address)
                setMarkerPosition({
                    latitude: response.data.address.latitude,
                    longitude: response.data.address.longitude
                })
                setViewPort({
                    latitude: response.data.address.latitude,
                    longitude: response.data.address.longitude,
                    zoom: 12,
                    bearing: 0,
                    pitch: 0
                })
            }
            else {
                console.log(response.data.error);
            }
        })
    }, [])

    const handleMarkerDragEnd = async (event) => {
        const { lngLat } = event;
        const latitude = lngLat.lat;
        const longitude = lngLat.lng;
        setMarkerPosition({ latitude, longitude });

        try {
            const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${import.meta.env.VITE_GEO_API_KEY}`);
            const result = await response.json();

            if (result.features && result.features.length > 0) {
                const NewAddress = result.features[0].properties.formatted;
                setNewAddress(NewAddress)
                setUserAddress({
                    ...userAddress,
                    name: NewAddress,
                    latitude: latitude,
                    longitude: longitude
                });
            }
        } catch (e) {
            console.log("Error while reverse geocoding:", e);
        }
    };

    return (
        <div className="p-1 bg-yellow-400 rounded-xl flex justify-center items-center w-full h-full" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <ReactMapGL
                {...viewPort}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                style={{
                    width: '100%',
                    height: '50vh' // Adjusts height to half of the viewport height
                }}
                mapStyle='mapbox://styles/mapbox/navigation-day-v1'
                onMove={event => setViewPort(event.viewState)}
                scrollZoom={false}
                setFog={true}
            >
                <Marker
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                    latitude={markerPosition ? markerPosition.latitude : viewPort.latitude}
                    longitude={markerPosition ? markerPosition.longitude : viewPort.longitude}
                >
                </Marker>
                <NavigationControl />
            </ReactMapGL>
        </div>
    )
}

export default MapBox
