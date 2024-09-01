const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    availability: {
        type: String,
        enum: ["available", "notavailable"],
        default: "available"
    }
})

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;