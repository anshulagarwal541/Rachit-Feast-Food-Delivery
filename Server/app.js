require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');
const Admin = require("./Models/Admin.js");
const Rider = require('./Models/Rider.js');
const Tip = require("./Models/Tip.js");
const Vendor = require('./Models/Vendor.js');
const Restaurant = require("./Models/Restaurant.js");
const Rating = require("./Models/Rating.js");
const Coupon = require("./Models/Coupon.js");
const cors = require('cors');
const User = require('./Models/User.js');
const Order = require('./Models/Order.js');
const { sign, verify } = require("jsonwebtoken");
const { hash } = require('bcrypt');
const bcrypt = require("bcrypt")
const fetch = require('node-fetch');


mongoose.connect(process.env.DB)
    .then(() => {
        console.log("Successfully connected to mongoose data");
    })
    .catch((e) => {
        console.log(e.message);
    })

// use ones..................................................................
app.use(cors());
app.use(express.json());


// middlewares..............................................................................
const userValidateToken = async (req, res, next) => {
    const accessToken = req.header("userAccessToken");
    if (!accessToken) {
        return res.json({ error: "You have not logged in.. !!" })
    }
    try {
        const validToken = verify(accessToken, process.env.SECRET_KEY);
        if (validToken) {
            req.user = validToken;
            next();
        }
    }
    catch (e) {
        return res.json({ error: e.message });
    }
}
const riderValidateToken = async (req, res, next) => {
    const accessToken = req.header("riderAccessToken");
    if (!accessToken) {
        return res.json({ error: "You have not logged in.. !!" })
    }
    try {
        const validToken = verify(accessToken, process.env.SECRET_KEY);
        if (validToken) {
            req.rider = validToken;
            next();
        }
    }
    catch (e) {
        return res.json({ error: e.message });
    }
}

const adminValidateToken = async (req, res, next) => {
    const accessToken = req.header("adminAccessToken");
    if (!accessToken) {
        return res.json({ error: "You have not logged in.. !!" })
    }
    try {
        const validToken = verify(accessToken, process.env.SECRET_KEY);
        if (validToken) {
            req.admin = validToken;
            next();
        }
    }
    catch (e) {
        return res.json({ error: e.message });
    }
}


// .................................................Routes .........................................
app.get("/", async (req, res) => {
    res.send("hello");
})


// ........................................Routes for admins......................................
app.get("/admin", adminValidateToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);
        res.json(admin)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/admin/allRestaurants", adminValidateToken, async (req, res) => {
    try {
        const allRestaurants = await Restaurant.find().populate({
            path: "vendor"
        });
        res.json(allRestaurants);
    } catch (e) {
        res.json({ error: e.message });
    }
})
app.post('/admin/getRestaurant', adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const restaurant = await Restaurant.findById(data._id).populate({
            path: "orders",
            populate: [
                { path: "user" },
                { path: "restaurant" },
                { path: "rider" },
                { path: "riderRating" },
                { path: "restaurantRating" }
            ]
        }).populate({
            path: "ratings",
            populate: [
                { path: "user" }
            ]
        });
        res.json(restaurant);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/admin/restaurant/:id/updateDetails", adminValidateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if(data.username=="" || data.password=="" || !data.password || !data.username)
        {
            return res.json({error: "Username or password is incorrect..!!"})
        }
        const admin=await Admin.findById(req.admin._id);
        if(data.password!=admin.memberPin.toString() || data.username!=admin.memberId)
        {
            return res.json({error: "Username or password is incorrect..!!"});
        }
        const d=data.r;
        let restaurant = await Restaurant.findByIdAndUpdate(id, d);
        await restaurant.save();
        res.json(restaurant)
    }
    catch (e) {
        res.json({ error: e.message })
    }
    
})
app.post("/admin/restaurant/:id/addCategory", adminValidateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let restaurant = await Restaurant.findById(id);
        if (restaurant.categories.length == 0) {
            restaurant.categories = data;
        }
        else {
            restaurant.categories.push(data);
        }
        await restaurant.save();
        res.json(restaurant)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/admin/restaurant/:id/addFood", adminValidateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const restaurant = await Restaurant.findById(id);
        if (restaurant.foods.length == 0) {
            restaurant.foods = data;
        }
        else {
            restaurant.foods.push(data);
        }
        await restaurant.save();
        res.json(restaurant)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/admin/restaurant/updateComissionRate", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const restaurant = await Restaurant.findById(data.id);
        restaurant.comissionRate = data.rate;
        await restaurant.save();
        const allRestaurants = await Restaurant.find()
        res.json(allRestaurants)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post('/admin/vendor/post', adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const newVendor = new Vendor(data);
        await newVendor.save();
        const allVendors = await Vendor.find();
        res.json(allVendors);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get('/admin/vendor', adminValidateToken, async (req, res) => {
    try {
        const allVendors = await Vendor.find();
        res.json(allVendors);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get('/vendor/:id/getRestaurant', adminValidateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findById(id).populate({
            path: 'restaurants'
        });
        const allRestaurants = vendor.restaurants;
        res.json(allRestaurants);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post('/admin/vendor/addRestaurant', adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const admin = await Admin.findOne({ memberId: data.adminId });
        if (!admin) {
            return res.json({ error: "admin-id or admin-pin is incorrect..!!" })
        }
        else if (admin.memberPin !== parseInt(data.adminPin)) {
            return res.json({ error: "admin-id or admin-pin is incorrect..!!" })
        }
        const vendor = await Vendor.findById(data.vendorId).populate({
            path: "restaurants"
        });
        const newRestaurant = new Restaurant({
            name: data.name,
            address: data.address,
            timing: [
                { day: "MON", openTime: "08:00", closeTime: "22:00", isClosed: false },
                { day: "TUE", openTime: "08:00", closeTime: "22:00", isClosed: false },
                { day: "WED", openTime: "08:00", closeTime: "22:00", isClosed: false },
                { day: "THU", openTime: "08:00", closeTime: "22:00", isClosed: false },
                { day: "FRI", openTime: "08:00", closeTime: "22:00", isClosed: false },
                { day: "SAT", openTime: "08:00", closeTime: "22:00", isClosed: false },
                { day: "SUN", openTime: "08:00", closeTime: "22:00", isClosed: true }
            ]
        });
        newRestaurant.vendor = vendor._id;
        var requestOptions = {
            method: 'GET',
        };
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${data.address}&apiKey=${process.env.GEO_API_KEY}`, requestOptions);
        const result = await response.json();
        if (result.features && result.features.length > 0) {
            newRestaurant.latitude = result.features[0].geometry.coordinates[1]; // Note: latitude is the second coordinate
            newRestaurant.longitude = result.features[0].geometry.coordinates[0];
        }
        await newRestaurant.save();
        if (vendor.restaurants.length == 0) {
            vendor.restaurants = newRestaurant._id;
        }
        else {
            vendor.restaurants.push(newRestaurant._id);
        }
        await vendor.save();
        const v = await Vendor.findById(data.vendorId).populate({
            path: "restaurants"
        });
        const allRestaurants = v.restaurants;
        res.json(allRestaurants)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post('/admin/restaurants/updateStatus', adminValidateToken, async (req, res) => {
    const data = req.body;
    const currentRestaurant = await Restaurant.findById(data.id);
    if (data.status == "active") {
        currentRestaurant.status = "inactive";
    }
    else {
        currentRestaurant.status = "active";
    }
    await currentRestaurant.save();
    const allRestaurants = await Restaurant.find().populate({
        path: "vendor"
    })
    res.json(allRestaurants)
})
app.get('/admin/getUsers', adminValidateToken, async (req, res) => {
    const allUsers = await User.find();
    res.json(allUsers);
})
app.get("/admin/allRiders", adminValidateToken, async (req, res) => {
    const allRiders = await Rider.find();
    res.json(allRiders);
})
app.post("/admin/postRider", adminValidateToken, async (req, res) => {
    const data = req.body;
    const newRider = new Rider(data);
    newRider.password = await bcrypt.hash(data.password, 10);
    await newRider.save();
    const accessToken = sign({
        username: data.username,
        _id: newRider._id
    }, process.env.SECRET_KEY)
    const allRiders = await Rider.find();
    res.json(allRiders);
})
app.post("/admin/updateRider", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const rider = await Rider.findById(data.id);
        if (rider.availability == "available") {
            rider.availability = "notavailable";
        }
        else {
            rider.availability = "available";
        }
        await rider.save();
        const allRiders = await Rider.find();
        res.json(allRiders);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get('/admin/allCoupons', adminValidateToken, async (req, res) => {
    try {
        const allCoupons = await Coupon.find();
        res.json(allCoupons);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/admin/restaurants/orders/updateStatus", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const currentOrder = await Order.findById(data.id).populate({
            path: "restaurant"
        });
        if (currentOrder.status == "pending") {
            currentOrder.status = "accepted";
        }
        else if (currentOrder.status == "delivery partner assigned") {
            currentOrder.status = "out for delivery"
        }
        await currentOrder.save();
        console.log(currentOrder)
        const restaurantOrders = await Restaurant.findById(currentOrder.restaurant._id).populate({
            path: "orders",
            populate: [
                { path: "user" },
                { path: "restaurant" },
                { path: "rider" },
                { path: "riderRating" },
                { path: "restaurantRating" }
            ]
        })
        res.json(restaurantOrders)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/admin/coupons", adminValidateToken, async (req, res) => {
    try {
        const allCoupons = await Coupon.find({ "availability": "available" });
        res.json(allCoupons);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/admin/restaurant/:id", adminValidateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id).populate({
            path: "coupons"
        });
        res.json(restaurant)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/admin/restaurant/:id/coupons/update", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);
        if (data.coupons.length <= 0) {
            restaurant.coupons = [];
        } else {
            if (data.coupons.length == 1) {
                const coupon = await Coupon.findById(data.coupons[0])
                restaurant.coupons = coupon._id;
            }
            else {
                const ans = [];
                for (const couponId of data.coupons) {
                    const coupon = await Coupon.findById(couponId);
                    if (coupon) {
                        ans.push(coupon._id);
                    }
                }
                restaurant.coupons = ans;
            }
        }
        await restaurant.save();
        res.json("Coupons updated successfully..!!")
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/admin/addCoupon", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const newCoupon = new Coupon(data);
        await newCoupon.save();
        const allCoupons = await Coupon.find();
        res.json(allCoupons);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/admin/updateCouponStatus", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const currentCoupon = await Coupon.findById(data.id);
        if (currentCoupon.availability == "available") {
            currentCoupon.availability = "notavailable";
        }
        else {
            currentCoupon.availability = "available";
        }
        await currentCoupon.save();
        const allCoupons = await Coupon.find();
        res.json(allCoupons);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/admin/deleteCoupon", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const deletedCoupon = await Coupon.findByIdAndDelete(data.id);
        const allCoupons = await Coupon.find();
        res.json(allCoupons);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/admin/addTips", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        data.tip1 = parseInt(data.tip1)
        data.tip2 = parseInt(data.tip2)
        data.tip3 = parseInt(data.tip3)
        console.log(data)
        const tips = await Tip.find();
        if (!tips || tips.length == 0) {
            console.log(tips)
            const newTip = new Tip(data);
            await newTip.save();
        }
        else {
            tips[0].tip1 = data.tip1;
            tips[0].tip2 = data.tip2;
            tips[0].tip3 = data.tip3;
            await tips[0].save();
        }
        res.json("Successfully updated the Tips for Riders...!!!");
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get("/admin/dispatch", adminValidateToken, async (req, res) => {
    try {
        const allOrders = await Order.find().populate({
            path: "restaurant"
        }).populate({
            path: "rider"
        }).populate({
            path: "user"
        })
        res.json(allOrders);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/admin/dispatch/update", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        if (data.riderId != "none") {
            const currentOrder = await Order.findById(data.orderId);
            const currentRider = await Rider.findById(data.riderId);
            currentRider.availability = "notavailable";
            currentRider.onGoingOrder = currentOrder._id;
            currentOrder.rider = currentRider._id;
            currentOrder.status = "delivery partner assigned"
            await currentRider.save();
            await currentOrder.save();
        }
        const allOrders = await Order.find().populate({
            path: "user"
        }).populate({
            path: "rider"
        }).populate({
            path: "restaurant"
        })
        res.json(allOrders)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/admin/restaurant/timing", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const restaurant = await Restaurant.findById(data.restaurantId);
        restaurant.timing = data.timing;
        await restaurant.save();
        res.json(restaurant.timing);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/admin/restaurant/timing/day", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const restaurant = await Restaurant.findById(data.restaurantId);
        let t = restaurant.timing.map(item => item.toObject());
        t = t.map(item =>
            item.day === data.day ? { ...item, isClosed: item.isClosed ? false : true } : item
        );
        restaurant.timing = t;
        await restaurant.save();
        res.json(restaurant.timing);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})













//...................................... Riders ......................................
app.get("/rider", riderValidateToken, async (req, res) => {
    try {
        const rider = await Rider.findById(req.rider._id);
        res.json(rider);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get("/rider/orders", riderValidateToken, async (req, res) => {
    try {
        const rider = await Rider.findById(req.rider._id).populate({
            path: "orders",
            populate: [
                { path: "restaurant" },
                { path: "user" },
                { path: "rider" },
                { path: "riderRating" },
                { path: "restaurantRating" }
            ]
        });
        const riderOrders = rider.orders;
        res.json(riderOrders);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/rider/accountUpdate", riderValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const currentRider = await Rider.findById(req.rider._id);
        if (currentRider.name !== data.name) {
            currentRider.name = data.name;
        }
        if (currentRider.phone.toString() !== data.phone) {
            if (data.phone.toString().length == 10) {
                currentRider.phone = data.phone;
            }
            else {
                return res.json({ error: "Phone number should be 10 digits.." })
            }
        }
        await currentRider.save();
        res.json("Successfully updated the account..!! :)")
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get("/rider/order/ongoing", riderValidateToken, async (req, res) => {
    try {
        const rider = await Rider.findById(req.rider._id).populate({
            path: "onGoingOrder",
            populate: [
                { path: "user" },
                { path: "restaurant" },
                { path: "rider" }
            ]
        });
        const onGoingOrder = rider.onGoingOrder;
        res.json(onGoingOrder);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/rider/order/complete", riderValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const code = data.code;
        const rider = await Rider.findById(req.rider._id).populate({
            path: "onGoingOrder",
            populate: [
                { path: "user" },
                { path: "restaurant" },
                { path: "rider" }
            ]
        });
        const orderCode = rider.onGoingOrder.customerCode;
        if (code == orderCode) {
            const currentOrder = rider.onGoingOrder;
            currentOrder.status = "completed";
            const money = rider.wallet;
            rider.wallet = money + 200 + (rider.onGoingOrder.tip ? rider.onGoingOrder.tip : 0);
            rider.onGoingOrder = null;
            rider.availability = "available";
            if (rider.orders.length == 0) {
                rider.orders = currentOrder._id;
            }
            else {
                rider.orders.push(currentOrder._id);
            }
            await currentOrder.save();
            await rider.save();
            res.json("Order Delivered Successfully..")
        }
        else {
            res.json({ error: "Code entered is incorrect" });
        }
    }
    catch (e) {
        res.json({ error: e.message })
    }
})









// Routes for vendors.................................................


// Routes for restaurants....................................


// ...............................Routes for users.............................................
app.get("/user", userValidateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "wishlist"
        })
        res.json(user)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get("/user/order/current", userValidateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "orders",
            populate: [
                { path: "user" },
                { path: "restaurant" },
                { path: "rider" }
            ]
        })
        const onGoingOrder = user.orders.find(order => order.status != "completed")
        console.log(onGoingOrder)
        res.json(onGoingOrder)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/user/restaurant/addfavourite", userValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const restaurant = await Restaurant.findById(data.restaurantId);
        const user = await User.findById(req.user._id).populate({
            path: "wishlist"
        });
        const wish = user.wishlist.find((res) => res._id == data.restaurantId)
        if (wish) {
            const filteredData = user.wishlist.filter((res) => res._id.toString() !== data.restaurantId)
            user.wishlist = filteredData;
        }
        else {
            if (user.wishlist.length == 0) {
                user.wishlist = restaurant._id;
            }
            else {
                user.wishlist.push(restaurant._id);
            }
        }
        await user.save();
        const currentUser = await User.findById(req.user._id).populate({
            path: "wishlist"
        });
        res.json(currentUser)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/user/details", userValidateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser) {
            res.json(currentUser)
        }
        else {
            res.json({ error: "No user currently logged in..!! Please login first." })
        }
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/user/orders", userValidateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)
            .populate({
                path: "orders",
                populate: [
                    { path: "rider" },
                    { path: "restaurant" }, // Populate restaurant details
                    { path: "user" },  // Populate user details
                    { path: "restaurantRating" },
                    { path: "riderRating" }
                ]
            });
        const orders = currentUser.orders;
        res.json(orders);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/user/orders", userValidateToken, async (req, res) => {
    try {
        const orders = await Order.findById(req.body.orderId).populate({
            path: "user"
        }).populate({
            path: "restaurant"
        }).populate({
            path: "rider"
        }).populate({
            path: "restaurantRating"
        }).populate({
            path: "riderRating"
        });
        res.json(orders);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/user/address", userValidateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)
        const data = req.body;
        var requestOptions = {
            method: 'GET',
        };
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${data.address}&apiKey=3b2d887ed6174074818fb94898b584f7`, requestOptions);
        const result = await response.json();
        if (result.features && result.features.length > 0) {
            currentUser.address.name = data.address;
            currentUser.address.latitude = result.features[0].geometry.coordinates[1]; // Note: latitude is the second coordinate
            currentUser.address.longitude = result.features[0].geometry.coordinates[0];
        }
        else {
            return res.json({ error: "The address you entered is not found on map.." })
        }
        await currentUser.save();
        res.json(currentUser.address)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/home/allRestaurants", async (req, res) => {
    try {
        const allRestaurants = await Restaurant.find().populate({
            path: "ratings"
        })
        res.json(allRestaurants);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/home/restaurant/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id).populate([
            { path: "ratings" },
            { path: "coupons" }
        ])
        res.json(restaurant)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/confirmCoupon", async (req, res) => {
    try {
        const data = req.body;
        const restaurant = await Restaurant.findById(data.restaurantId).populate({
            path: "coupons"
        })
        if (restaurant.coupons.length > 0) {
            const coupon = restaurant.coupons.find(coupon => coupon.title == data.coupon && coupon.availability == "available")
            if (coupon) {
                return res.json(coupon.discount);
            }
            else {
                return res.json({ error: "Invalid Coupon Code entered.." })
            }
        }
        else {
            return res.json({ error: "Invalid Coupon entered.!!" })
        }

    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/user/bill", userValidateToken, async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        const currentUser = await User.findById(req.user._id);
        if (data.foods.length > 0) {
            currentUser.pendingOrder.foods = data.foods;
            currentUser.pendingOrder.restaurant = data.restaurantId;
        }
        else {
            currentUser.pendingOrder.foods = data.foods;
            currentUser.pendingOrder.restaurant = null;
        }
        await currentUser.save();
        res.json("done")
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/user/bill/reset", userValidateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.pendingOrder.foods = [];
        user.pendingOrder.restaurant = null;
        await user.save();
        res.json(user.pendingOrder)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/user/getBill", userValidateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).populate({
            path: "pendingOrder",
            populate: [
                { path: "restaurant" }
            ]
        });
        res.json(currentUser.pendingOrder);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get("/tips", async (req, res) => {
    try {
        const tips = await Tip.find();
        res.json(tips[0])
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/user/placeOrder", userValidateToken, async (req, res) => {
    try {
        const finalOrder = req.body;
        const currentUser = await User.findById(finalOrder.user._id).populate({
            path: "orders"
        });
        const onGoingOrder = currentUser.orders.find(order => order.status != "completed")
        if (onGoingOrder) {
            return res.json({ error: "Sorry, you already have an on going order. Can't place a new Order yet..!!" })
        }
        const newOrder = new Order({
            orderTime: finalOrder.orderDate,
            totalAmount: finalOrder.totalAmount,
            couponName: finalOrder.couponName,
            couponDiscount: finalOrder.couponDiscount,
            tip: finalOrder.tip,
            tax: finalOrder.tax
        })
        newOrder.user = finalOrder.user._id;
        newOrder.restaurant = finalOrder.restaurant._id;
        newOrder.items = finalOrder.items;
        await newOrder.save();
        const currentRestaurant = await Restaurant.findById(finalOrder.restaurant._id);
        if (currentUser.orders.length > 0) {
            currentUser.orders.push(newOrder._id);
        }
        else {
            currentUser.orders = newOrder._id;
        }
        if (currentRestaurant.orders.length > 0) {
            currentRestaurant.orders.push(newOrder._id);
        }
        else {
            currentRestaurant.orders = newOrder._id;
        }
        currentUser.pendingOrder = null;
        await currentUser.save();
        await currentRestaurant.save();
        res.json("Order placed..!!")
    }
    catch (e) {
        res.json({ error: e.error });
    }
})
app.post("/user/accountUpdate", userValidateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const data = req.body;
        user.name = data.name;
        user.email = data.email;
        console.log(data)
        if (data.email == "") {
            return res.json({ error: "Email is required" })
        }
        if (data.name == "") {
            return res.json({ error: "Name is required...!!" })
        }
        if (!data.phone) {
            return res.json({ error: "Phone number is required..!!" })
        }
        if (data.phone.length !== 10) {
            return res.json({ error: "Phone number should be 10 digits.!!" });
        }
        user.phone = data.phone;
        await user.save();
        res.json("done successfully")
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/user/food/restaurant", async (req, res) => {
    try {
        const food = req.body.food.toLowerCase();
        const allRestaurants = await Restaurant.find();
        const matchingRestaurants = await Restaurant.find({
            "foods.name": { $regex: new RegExp(food, "i") } // Case-insensitive match
        });

        res.json(matchingRestaurants)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/user/restaurant/rating", userValidateToken, async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        const currentOrder = await Order.findById(data.order._id)
        const newRating = new Rating({
            rating: data.rating
        })
        newRating.user = data.order.user._id;
        const restaurant = await Restaurant.findById(data.order.restaurant._id).populate({
            path: "ratings"
        });
        await newRating.save();
        if (restaurant.ratings.length == 0) {
            restaurant.ratings = newRating._id;
        }
        else {
            restaurant.ratings.push(newRating._id);
        }
        await restaurant.save();
        const currentRestaurant = await Restaurant.findById(data.order.restaurant._id).populate({
            path: "ratings"
        })
        let sum = 0;
        let count = 0;
        currentRestaurant.ratings.forEach((rate) => {
            sum += rate.rating;
            count++;
        })
        const rating = (Math.ceil(sum / count));
        currentRestaurant.totalRating = parseInt(rating);
        currentOrder.restaurantRating = newRating._id;
        await currentOrder.save();
        await currentRestaurant.save();
        const allOrders = await User.findById(data.order.user._id).populate({
            path: "orders",
            populate: [
                { path: "rider" },
                { path: "restaurant" }, // Populate restaurant details
                { path: "user" },  // Populate user details
                { path: "restaurantRating" },
                { path: "riderRating" }
            ]
        });
        res.json(allOrders.orders)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/user/rider/rating", userValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const currentOrder = await Order.findById(data.order._id)
        const newRating = new Rating({
            rating: data.rating
        })
        newRating.user = data.order.user._id;
        await newRating.save();
        const rider = await Rider.findById(data.order.rider._id).populate({
            path: "reviews"
        });
        if (rider.reviews.length == 0) {
            rider.reviews = newRating._id;
        }
        else {
            rider.reviews.push(newRating._id);
        }
        await rider.save();
        const currentRider = await Rider.findById(data.order.rider._id).populate({
            path: "reviews"
        })
        let sum = 0;
        let count = 0;
        currentRider.reviews.forEach((rate) => {
            sum += rate.rating;
            count++;
        })
        const rating = (Math.ceil(sum / count));
        currentRider.totalRating = parseInt(rating);
        currentOrder.riderRating = newRating._id;
        await currentOrder.save();
        await currentRider.save();
        const allOrders = await Order.findById(data.order._id)
            .populate([
                { path: "rider" },
                { path: "restaurant" }, // Populate restaurant details
                { path: "user" },  // Populate user details
                { path: "restaurantRating" },
                { path: "riderRating" }
            ]);
        res.json(allOrders)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})












//............................Routes for authentication.................................
app.post("/signup", async (req, res) => {
    try {
        const data = req.body;
        const usernameLoggedIn = await User.findOne({ username: req.body.username });
        const emailLoggedIn = await User.findOne({ email: req.body.email });
        if (usernameLoggedIn) {
            return res.json({ error: "Username already registered !!" })
        }
        else if (emailLoggedIn) {
            return res.json({ error: "Email already registered !!" })
        }
        else {
            const newUser = new User({
                username: data.username,
                name: data.name,
                phone: data.phone,
                email: data.email
            })
            newUser.password = await bcrypt.hash(data.password, 10);
            await newUser.save();
            const accessToken = sign({
                username: data.username,
                _id: newUser._id
            }, process.env.SECRET_KEY)
            res.json(accessToken);
        }
    }
    catch (e) {
        res.json({ error: e.message })
    }
})

app.post('/login', async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({ username: data.username });
        if (!user) {
            return res.json({ error: "You must create an account first !!" })
        }
        const result = await bcrypt.compare(data.password, user.password);
        if (result) {
            const accessToken = sign({ username: data.username, _id: user._id }, process.env.SECRET_KEY);
            res.json(accessToken);
        }
        else {
            res.json({ error: "The username or password is incorrect..!!" });
        }
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/admin/login", async (req, res) => {
    try {
        const data = req.body;
        const admin = await Admin.findOne({ memberId: data.adminId });
        if (!admin) {
            res.json({ error: "admin-id or admin-pin is incorrect..!!!" })
        }
        else {
            if (admin.memberPin !== parseInt(data.adminPin)) {
                res.json({ error: "admin-id or admin-pin is incorrect..!!!" })
            }
            else {
                const accessToken = sign({
                    username: data.memberId,
                    _id: admin._id
                }, process.env.SECRET_KEY)
                res.json(accessToken)
            }
        }
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/rider/login", async (req, res) => {
    try {
        const data = req.body;
        const rider = await Rider.findOne({ username: data.username });
        if (!rider) {
            res.json({ error: "username or password is incorrect..!!!" })
        }
        else {
            const result = await bcrypt.compare(data.password, rider.password);
            if (!result) {
                res.json({ error: "username or password is incorrect..!!!" })
            }
            else {
                const accessToken = sign({
                    username: data.username,
                    _id: rider._id
                }, process.env.SECRET_KEY)
                res.json(accessToken)
            }
        }
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/vendor/login", async (req, res) => {
    try {
        const data = req.body;
    }
    catch (e) {
        res.json({ error: e.message })
    }
})


app.listen(port, async (req, res) => {
    console.log(`Successfully started on the port : ${port}`);
})