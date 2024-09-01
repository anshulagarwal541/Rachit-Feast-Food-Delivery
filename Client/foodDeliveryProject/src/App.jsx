import Home from "./components/Admin/Home/Home"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Vendors from "./pages/Admin/Vendors"
import Restaurants from "./pages/Admin/Restaurants"
import RestaurantGraph from "./components/Admin/Restaurant/RestaurantGraph"
import Users from "./pages/Admin/Users"
import Riders from "./pages/Admin/Riders"
import Coupons from "./pages/Admin/Coupons"
import Tipping from "./pages/Admin/Tipping"
import AddRestaurant from "./pages/Admin/AddRestaurant"
import MainLayout from "./pages/Admin/MainLayout"
import RestaurantMainLayout from "./components/Admin/Restaurant/RestaurantMainLayout"
import RestaurantProfile from "./components/Admin/Restaurant/RestaurantProfile"
import AddFood from "./components/Admin/Restaurant/AddFood"
import AddFoodCategory from "./components/Admin/Restaurant/AddFoodCategory"
import RestaurantOrders from "./components/Admin/Restaurant/RestaurantOrders"
import RestaurantRating from "./components/Admin/Restaurant/RestaurantRating"
import RestaurantTiming from "./components/Admin/Restaurant/RestaurantTiming"
import RachitFeast from "./pages/RachitFeast"
import RestaurantDashboard from "./components/User/Restaurant/RestaurantDashboard"
import Login from "./pages/Authentication/Login"
import Signup from "./pages/Authentication/Signup"
import { AuthContext } from "./Helpers/AuthContext"
import Dispatch from "./pages/Admin/Dispatch"
import ComissionRates from "./pages/Admin/ComissionRates"
import WithdrawlRequest from "./pages/Admin/WithdrawlRequest"
import { useState, useEffect } from "react"
import AdminLogin from "./pages/Authentication/AdminLogin"
import VendorLogin from "./pages/Authentication/VendorLogin"
import RiderLogin from "./pages/Authentication/RiderLogin"
import OrderCheckout from "./pages/User/OrderCheckout"
import UserOrders from "./pages/User/UserOrders"
import OrderReciept from "./components/User/OrdersHistory/OrderReciept"
import UserWishlist from "./components/User/Wishlist/UserWishlist"
import UserAccountUpdate from "./components/User/Account/UserAccountUpdate"
import RestaurantCircle from "./components/User/FoodCircle/RestaurantCircle"
import RiderHome from "./pages/Rider/Home/RiderHome"
import RiderAccount from "./components/Rider/Account/RiderAccount"
import RiderOrderHistory from "./components/Rider/Order History/RiderOrderHistory"
import RiderCurrentOrder from "./components/Rider/Current Order/RiderCurrentOrder"
import OrderCountDown from "./components/User/Wishlist/UserStopWatch/OrderStopWatch"
import RestaurantCoupons from "./components/Admin/Restaurant/RestaurantCoupons"
import UserCurrentOrder from "./components/User/CurrentOrder/UserCurrentOrder"

function App() {
  const url = import.meta.env.VITE_URL
  const [vendor, setVendor] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [user, setUser] = useState(null);
  const [rider, setRider] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState(null)

  useEffect(() => {
    const userAccessToken = localStorage.getItem("userAccessToken");
    const adminAccessToken = localStorage.getItem("adminAccessToken");
    const riderAccessToken = localStorage.getItem("riderAccessToken");
    const vendorAccessToken = localStorage.getItem("vendorAccessToken");

    setUser(userAccessToken)
    setAdmin(adminAccessToken)
    setVendor(vendorAccessToken)
    setRider(riderAccessToken);
  }, [user, admin, rider, vendor])

  return (
    <div>
      <AuthContext.Provider value={{
        url,
        rider,
        setRider,
        user,
        setUser,
        admin,
        setAdmin,
        vendor,
        setVendor,
        restaurant,
        setRestaurant,
        error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType
      }}>
        <Router>
          <Routes>

            {/* Route for public home page */}
            <Route path="/" element={<RachitFeast />} />
            <Route path="/home/restaurant/:id" element={<RestaurantDashboard />} />
            <Route path="/restaurant/:id/order/checkout" element={<OrderCheckout />} />
            <Route path="/user/:id/orders" element={<UserOrders />} />
            <Route path="/user/:userId/orders/:orderId" element={<OrderReciept />} />
            <Route path="/user/:id/wishlist" element={<UserWishlist />} />
            <Route path="/user/account" element={<UserAccountUpdate />} />
            <Route path="/user/:food" element={<RestaurantCircle />} />
            <Route path="/user/order/complete/track" element={<UserCurrentOrder />} />



            {/* Route for public home page */}
            <Route path="/rider/home" element={<RiderHome />} />
            <Route path="/rider/accountUpdate" element={<RiderAccount />} />
            <Route path="/rider/history/order" element={<RiderOrderHistory />} />
            <Route path="/rider/order/current" element={<RiderCurrentOrder />} />





            {/* Routes wrapped with admin's Dashboard layout */}
            <Route path="/admin" element={<MainLayout />}>
              <Route path="" element={<Home />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="users" element={<Users />} />
              <Route path="riders" element={<Riders />} />
              <Route path="configurations" element={<Home />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="tippings" element={<Tipping />} />
              <Route path="dispatch" element={<Dispatch />} />
              <Route path="comissionRates" element={<ComissionRates />} />
              <Route path="withdrawlRequest" element={<WithdrawlRequest />} />
            </Route>


            {/* Route without Dashboard layout */}
            <Route path="/admin/vendor/:id/addRestaurant" element={<AddRestaurant />} />


            {/* Route with restaurant Dashboard layout */}
            <Route path="/restaurant/:id" element={<RestaurantMainLayout />} >
              <Route path="" element={<RestaurantGraph />} />
              <Route path="profile" element={<RestaurantProfile />} />
              <Route path="food" element={<AddFood />} />
              <Route path="category" element={<AddFoodCategory />} />
              <Route path="orders" element={<RestaurantOrders />} />
              <Route path="coupons" element={<RestaurantCoupons />} />
              <Route path="ratings" element={<RestaurantRating />} />
              <Route path="timings" element={<RestaurantTiming />} />
              <Route path="location" element={<RestaurantGraph />} />
              <Route path="admin" element={<RestaurantGraph />} />
            </Route>


            {/* Route for login or signup */}
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/rider/login" element={<RiderLogin />} />


          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  )
}

export default App
