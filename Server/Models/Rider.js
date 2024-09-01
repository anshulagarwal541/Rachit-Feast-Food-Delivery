const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    availability: {
        type: String,
        enum: ["available", "notavailable"],
        default: "available"
    },
    onGoingOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating"
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    totalRating: {
        type: Number,
        default: 0
    },
    wallet: {
        type: Number,
        default: 0
    }
})
const Rider = mongoose.model("Rider", riderSchema)

module.exports = Rider;