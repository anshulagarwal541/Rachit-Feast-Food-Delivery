const mongoose = require('mongoose');
const Restaurant = require("./Restaurant.js");
const Rating = require("./Rating.js");
const User = require("./User.js");

const orderSchema = new mongoose.Schema({
    orderNo: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    paymentMode: {
        type: String,
        default: 'COD'
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', "completed", 'delivery partner assigned', "out for delivery", 'pending'],
        default: 'pending'
    },
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rider"
    },
    orderTime: {
        type: String,
        required: true
    },
    riderRating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    },
    restaurantRating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    },
    items: [
        {
            item: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    couponName: {
        type: String,
        default: "N.A"
    },
    couponDiscount: {
        type: Number,
        default: 0.0
    },
    tip: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number
    },
    customerCode: {
        type: Number
    }
});

// Function to generate a 4-digit random customer code
function generateCustomerCode() {
    return Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
}

// Function to generate a unique order number
function generateOrderNo() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
    const month = ("0" + (now.getMonth() + 1)).slice(-2); // Month with leading zero
    const day = ("0" + now.getDate()).slice(-2); // Day with leading zero
    const hours = ("0" + now.getHours()).slice(-2); // Hours with leading zero
    const minutes = ("0" + now.getMinutes()).slice(-2); // Minutes with leading zero
    const seconds = ("0" + now.getSeconds()).slice(-2); // Seconds with leading zero

    return `ORD${year}${month}${day}${hours}${minutes}${seconds}`; // Example: ORD230821124530
}

// Example of how you might use these functions in the schema pre-save hook
orderSchema.pre('save', function (next) {
    if (!this.customerCode) {
        this.customerCode = generateCustomerCode();
    }

    if (!this.orderNo) {
        this.orderNo = generateOrderNo();
    }

    next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;