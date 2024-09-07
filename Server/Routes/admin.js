require('dotenv').config();
const express = require('express')
const router = express.Router();
const { adminValidateToken } = require('../Middlewares/index.js');
const Admin = require("../Models/Admin.js");
const Rider = require('../Models/Rider.js');
const Tip = require("../Models/Tip.js");
const User = require('../Models/User.js');
const Order = require('../Models/Order.js');
const Vendor = require('../Models/Vendor.js');
const Restaurant = require("../Models/Restaurant.js");
const Rating = require("../Models/Rating.js");
const Coupon = require("../Models/Coupon.js");
const fetch = require('node-fetch');


router.get("/", adminValidateToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);
        res.json(admin)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
router.get("/allRestaurants", adminValidateToken, async (req, res) => {
    try {
        const allRestaurants = await Restaurant.find().populate({
            path: "vendor"
        });
        res.json(allRestaurants);
    } catch (e) {
        res.json({ error: e.message });
    }
})
router.post('/getRestaurant', adminValidateToken, async (req, res) => {
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
router.post("/restaurant/:id/updateDetails", adminValidateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.username == "" || data.password == "" || !data.password || !data.username) {
            return res.json({ error: "Username or password is incorrect..!!" })
        }
        const admin = await Admin.findById(req.admin._id);
        if (data.password != admin.memberPin.toString() || data.username != admin.memberId) {
            return res.json({ error: "Username or password is incorrect..!!" });
        }
        const d = data.r;
        let restaurant = await Restaurant.findByIdAndUpdate(id, d);
        await restaurant.save();
        res.json(restaurant)
    }
    catch (e) {
        res.json({ error: e.message })
    }

})
router.post("/restaurant/:id/addCategory", adminValidateToken, async (req, res) => {
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
router.post("/restaurant/:id/addFood", adminValidateToken, async (req, res) => {
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
router.post("/restaurant/updateComissionRate", adminValidateToken, async (req, res) => {
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
router.post('/vendor/post', adminValidateToken, async (req, res) => {
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
router.get('/vendor', adminValidateToken, async (req, res) => {
    try {
        const allVendors = await Vendor.find();
        res.json(allVendors);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
router.post('/vendor/addRestaurant', adminValidateToken, async (req, res) => {
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
router.post('/restaurants/updateStatus', adminValidateToken, async (req, res) => {
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
router.get('/getUsers', adminValidateToken, async (req, res) => {
    const allUsers = await User.find();
    res.json(allUsers);
})
router.get("/allRiders", adminValidateToken, async (req, res) => {
    const allRiders = await Rider.find();
    res.json(allRiders);
})
router.post("/rider/withdraw/approved", adminValidateToken, async (req, res) => {
    try {
        const rider = await Rider.findById(req.body.id);
        rider.wallet = 0;
        rider.withdrawRequest = false;
        await rider.save();
        const allRiders = await Rider.find();
        res.json(allRiders);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
router.post("/postRider", adminValidateToken, async (req, res) => {
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
router.post("/updateRider", adminValidateToken, async (req, res) => {
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
router.get('/allCoupons', adminValidateToken, async (req, res) => {
    try {
        const allCoupons = await Coupon.find();
        res.json(allCoupons);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
router.get("/allOrders", adminValidateToken, async (req, res) => {
    try {
        const allOrders=await Order.find()
        res.json(allOrders)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
router.post("/restaurants/orders/updateStatus", adminValidateToken, async (req, res) => {
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
router.get("/coupons", adminValidateToken, async (req, res) => {
    try {
        const allCoupons = await Coupon.find({ "availability": "available" });
        res.json(allCoupons);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
router.get("/restaurant/:id", adminValidateToken, async (req, res) => {
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
router.post("/restaurant/:id/coupons/update", adminValidateToken, async (req, res) => {
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
router.post("/addCoupon", adminValidateToken, async (req, res) => {
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
router.post("/updateCouponStatus", adminValidateToken, async (req, res) => {
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
router.post("/deleteCoupon", adminValidateToken, async (req, res) => {
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
router.post("/addTips", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        data.tip1 = parseInt(data.tip1)
        data.tip2 = parseInt(data.tip2)
        data.tip3 = parseInt(data.tip3)
        const tips = await Tip.find();
        if (!tips || tips.length == 0) {
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
router.get("/dispatch", adminValidateToken, async (req, res) => {
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
router.post("/dispatch/update", adminValidateToken, async (req, res) => {
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
router.post("/restaurant/timing", adminValidateToken, async (req, res) => {
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
router.post("/restaurant/timing/day", adminValidateToken, async (req, res) => {
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

module.exports = { router };