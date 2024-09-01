const mongoose = require('mongoose');
const Vendor = require('./Vendor.js');
const Order = require("./Order.js");
const Rating = require("./Rating.js");
const Coupon = require("./Coupon.js");

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Restaurant name is required"]
    },
    address: {
        type: String,
        required: [true, "restaurant address is required"]
    },
    longitude: {
        type: Number,
        default: 0.0
    },
    latitude: {
        type: Number,
        default: 0.0
    },
    deliveryCircle: {
        type: Number,
        default: 10,
        required: [false, "Restaurant range is required"]
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: [true, "Every restaurant should have a vendor"]
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    comissionRate: {
        type: Number,
        default: 2
    },
    deliveryTime: {
        type: Number,
        default: 30
    },
    categories: [
        {
            name: {
                type: String,
                required: true
            }
        }
    ],
    foods: [
        {
            name: {
                type: String,
                required: true,
                index: true
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            category: {
                type: String,
                required: true
            }
        }
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating"
        }
    ],
    totalRating: {
        type: Number,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        min: 0,
        default: 35
    },
    coupons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon"
        }
    ],
    timing: [
        {
            day: {
                type: String,
                enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
            },
            openTime: {
                type: String,
            },
            closeTime: {
                type: String,
            },
            isClosed: {
                type: Boolean,
            }
        }
    ]
})

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;