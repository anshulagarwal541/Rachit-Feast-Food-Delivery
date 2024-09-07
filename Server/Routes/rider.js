require('dotenv').config();
const express = require("express")
const router = express.Router();
const { riderValidateToken } = require('../Middlewares/index.js');
const Admin = require("../Models/Admin.js");
const Rider = require('../Models/Rider.js');
const Tip = require("../Models/Tip.js");
const User = require('../Models/User.js');
const Vendor = require('../Models/Vendor.js');
const Order = require('../Models/Order.js');
const Restaurant = require("../Models/Restaurant.js");
const Rating = require("../Models/Rating.js");
const Coupon = require("../Models/Coupon.js");
const fetch = require('node-fetch');

router.get("/", riderValidateToken, async (req, res) => {
    try {
        const rider = await Rider.findById(req.rider._id).populate({
            path: "orders",
            populate: [
                { path: "riderRating" },
                { path: "tip" }
            ]
        });
        res.json(rider);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
router.get("/orders", riderValidateToken, async (req, res) => {
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
router.post("/accountUpdate", riderValidateToken, async (req, res) => {
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
router.get("/order/ongoing", riderValidateToken, async (req, res) => {
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
router.post("/order/complete", riderValidateToken, async (req, res) => {
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
router.get("/wallet/withdraw", riderValidateToken, async (req, res) => {
    try {
        const rider = await Rider.findById(req.rider._id).populate([
            { path: "onGoingOrder" },
            { path: "reviews" },
            { path: "orders" }
        ]);
        if (rider.withdrawRequest) {
            return res.json({ error: "Please wait for the admin to accept your previous withdraw request..!!" });
        }
        if (rider.wallet == 0 || !rider.wallet) {
            return res.json({ error: "Sorry you can't withdraw anything..!! :(" })
        }
        rider.withdrawRequest = true;
        await rider.save();
        res.json(rider)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})

module.exports = { router }