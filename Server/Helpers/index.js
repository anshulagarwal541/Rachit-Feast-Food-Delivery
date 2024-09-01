require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../Models/Admin.js');
const { admins } = require('./appAdmins.js');
const Restaurant = require("../Models/Restaurant.js");
const Order = require("../Models/Order.js");
const Rider = require("../Models/Rider.js")
const Vendor = require("../Models/Vendor.js")
const Coupon = require("../Models/Coupon.js")
const Rating = require("../Models/Rating.js")
const User = require("../Models/User.js");

mongoose.connect(`${process.env.DB}`)
    .then(() => {
        console.log("Successfully connected to mongoose");
        resetInit();
    })
    .catch((e) => {
        console.log("error occured while connecting to mongoose database..");
    })

const resetInit = async () => {
    await Restaurant.deleteMany();
    await User.deleteMany();
    await Admin.deleteMany();
    await Vendor.deleteMany();
    await Rider.deleteMany();
    await Rating.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();

    admins.forEach(async (admin) => {
        const newadmin = new Admin({
            name: admin.name,
            phone: admin.phone,
            memberId: admin.memberId,
            email: admin.email,
            memberPin: admin.memberPin
        })
        await newadmin.save();
    })
}