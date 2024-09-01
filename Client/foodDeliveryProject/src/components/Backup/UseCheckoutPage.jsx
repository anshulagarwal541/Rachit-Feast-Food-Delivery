import React from 'react'
// import UserHeader from '../../components/User/UserHeader'
// import React, { useState, useEffect, useRef, useContext } from 'react'
// import ReactMapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';
// import axios from 'axios';
// import { AuthContext } from '../../Helpers/AuthContext';
// import { foodDeliveryLogo } from '../../../public';
// import BillList from './BillList';
// import BillInfo from './BillInfo';
// import { useNavigate } from 'react-router-dom';
// import MapBox from './MapBox';


function UseCheckoutPage() {
    // function OrderCheckout() {
    //     const { url, restaurant, setRestaurant, restaurantId, setRestaurantId } = useContext(AuthContext)
    //     const [viewPort, setViewPort] = useState({
    //         latitude: 28.7041,
    //         longitude: 77.1025,
    //         zoom: 12,
    //         bearing: 0,
    //         pitch: 0
    //     })
    //     const [selected, setSelected] = useState(null)
    //     const [currentDate, setCurrentDate] = useState(null)
    //     const [bill, setBill] = useState(null)
    //     const [addAddress, setAddAddress] = useState(false);
    //     const [newAddress, setNewAddress] = useState(null);
    //     const navigate = useNavigate();
    //     const [isAddressChanged, setIsAddressChanged] = useState(false);
    //     const [user, setUser] = useState(null)

    //     useEffect(() => {
    //         axios.get(`${url}/home/restaurant/${restaurantId}`).then((response) => {
    //             if (!response.data.error) {
    //                 setRestaurant(response.data);
    //                 setViewPort({
    //                     latitude: restaurant.latitude,
    //                     longitude: restaurant.longitude,
    //                     zoom: 15,
    //                     bearing: 0,
    //                     pitch: 0
    //                 })
    //             }
    //             else {
    //                 console.log(response.data.error);
    //             }
    //         })

    //         axios.get(`${url}/user/getBill`, {
    //             headers: {
    //                 userAccessToken: localStorage.getItem("userAccessToken")
    //             }
    //         }).then((response) => {
    //             if (!response.data.error) {
    //                 setBill(response.data)
    //             }
    //             else {
    //                 console.log(response.data.error);
    //             }
    //         })

    //         const date = new Date();
    //         const formattedDate = date.toLocaleDateString('en-GB', {
    //             day: '2-digit',
    //             month: '2-digit',
    //             year: 'numeric'
    //         }).replace(/\//g, '-');
    //         const formattedTime = date.toLocaleTimeString('en-US', {
    //             hour: 'numeric',
    //             minute: 'numeric',
    //             hour12: true
    //         });
    //         setCurrentDate(`${formattedDate} | ${formattedTime}`)
    //     }, [])

    //     const handleAddAddress = (e) => {
    //         e.preventDefault();
    //         const formData = new FormData(e.target);
    //         const data = {
    //             address: formData.get("address")
    //         }
    //         axios.post(`${url}/user/address`, data, {
    //             headers: {
    //                 userAccessToken: localStorage.getItem("userAccessToken")
    //             }
    //         }).then((response) => {
    //             if (!response.data.error) {
    //                 setNewAddress(response.data.name)
    //                 setIsAddressChanged(!isAddressChanged)
    //                 setAddAddress(false)
    //             }
    //             else {
    //                 console.log(response.data.error);
    //             }
    //         })

    //     }


    //     return (
    //         <div className='relative bg-indigo-50 h-fit'>
    //             <UserHeader />
    //             <div className='relative pb-1 bg-yellow-400'>
    //                 <ReactMapGL
    //                     {...viewPort}
    //                     mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
    //                     style={{
    //                         width: "100%",
    //                         height: '500px'
    //                     }}
    //                     mapStyle='mapbox://styles/mapbox/navigation-day-v1'
    //                     onMove={event => setViewPort(event.viewState)}
    //                     scrollZoom={false}
    //                     setFog={true}
    //                 >
    //                     {restaurant && (
    //                         <Marker
    //                             latitude={restaurant.latitude}
    //                             longitude={restaurant.longitude}
    //                         >
    //                         </Marker>
    //                     )}
    //                     {user && user.address.name!="" && (
    //                         <Marker
    //                             latitude={user.address.latitude}
    //                             longitude={user.address.longitude}
    //                         >
    //                         </Marker>
    //                     )}
    //                     <NavigationControl style={{ marginRight: "50px" }} />
    //                 </ReactMapGL>
    //             </div>
    //             <div className='relative w-[60%] h-fit py-10 flex flex-col gap-5 mx-auto'>
    //                 <div className='w-full mx-auto rounded-2xl px-5 py-2 bg-indigo-950 text-white font-bold flex gap-10 items-center'>
    //                     <img src={foodDeliveryLogo} alt="" className='w-[5rem] h-[5rem] rounded-full' />
    //                     <div className=' flex flex-col gap-1'>
    //                         <p className='text-xl'>Order Time : </p>
    //                         <p className='text-2xl'>{currentDate}</p>
    //                     </div>
    //                 </div>
    //                 <div className='w-full gap-5 flex justify-evenly'>
    //                     <AuthContext.Provider value={{ user, setUser, isAddressChanged, setNewAddress, newAddress, addAddress, setAddAddress, url, restaurantId, bill, setBill, restaurant, setRestaurant }}>
    //                         <BillList />
    //                         <BillInfo />
    //                     </AuthContext.Provider>
    //                 </div>
    //             </div>
    //             {addAddress && (
    //                 <div className='fixed top-0 left-0 w-full h-full z-50 backdrop-blur-md flex items-center justify-center'>
    //                     <AuthContext.Provider value={{ setNewAddress, newAddress }}>
    //                         <div className='p-10 bg-indigo-950 text-white flex flex-col gap-5'>
    //                             <MapBox url={url} width="300px" height="200px" />
    //                             <form onSubmit={handleAddAddress} action="POST" className='flex flex-col gap-5'>
    //                                 <label htmlFor="address" className='text-2xl font-bold'>Add Address :</label>
    //                                 <input type="text"
    //                                     name="address"
    //                                     id="address"
    //                                     onChange={(e) => setNewAddress(e.target.value)}
    //                                     value={newAddress ? newAddress : ""}
    //                                     placeholder='full address'
    //                                     className='border-2 text-black border-yellow-400 w-full rounded-2xl px-5 py-2'
    //                                 />
    //                                 <button className='bg-white px-5 py-2 font-bold text-indigo-950'>Add</button>
    //                             </form>
    //                             <button onClick={() => setAddAddress(false)} className='bg-white px-5 py-2 font-bold text-indigo-950'>Cancel</button>
    //                         </div>
    //                     </AuthContext.Provider>
    //                 </div>
    //             )}
    //         </div>
    //     )
    // }

    // export default OrderCheckout

    return (
        <div>
            backup
        </div>
    )
}

export default UseCheckoutPage