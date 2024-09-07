require('dotenv').config();
const express = require('express')
const router = express.Router();
const { userValidateToken } = require('../Middlewares/index.js');
const Admin = require("../Models/Admin.js");
const User = require('../Models/User.js');
const Rider = require('../Models/Rider.js');
const Tip = require("../Models/Tip.js");
const Order = require('../Models/Order.js');
const Vendor = require('../Models/Vendor.js');
const Restaurant = require("../Models/Restaurant.js");
const Rating = require("../Models/Rating.js");
const Coupon = require("../Models/Coupon.js");
const fetch = require('node-fetch');


router.get("/", userValidateToken, async (req, res) => {
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
router.get("/order/current", userValidateToken, async (req, res) => {
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
        res.json(onGoingOrder)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
router.post("/restaurant/addfavourite", userValidateToken, async (req, res) => {
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
router.get("/details", userValidateToken, async (req, res) => {
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
router.get("/orders", userValidateToken, async (req, res) => {
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
router.post("/orders", userValidateToken, async (req, res) => {
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
router.post("/address", userValidateToken, async (req, res) => {
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

router.post("/placeOrder", userValidateToken, async (req, res) => {
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
router.post("/accountUpdate", userValidateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const data = req.body;
        user.name = data.name;
        user.email = data.email;
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
router.post("/food/restaurant", async (req, res) => {
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
router.post("/restaurant/rating", userValidateToken, async (req, res) => {
    try {
        const data = req.body;
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
router.post("/rider/rating", userValidateToken, async (req, res) => {
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

router.post("/bill", userValidateToken, async (req, res) => {
    try {
        const data = req.body;
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
router.get("/bill/reset", userValidateToken, async (req, res) => {
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
router.get("/getBill", userValidateToken, async (req, res) => {
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

module.exports = { router }