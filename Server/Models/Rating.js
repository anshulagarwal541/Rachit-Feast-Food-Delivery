const mongoose = require("mongoose");
const User = require("./User.js");

const ratingSchema = new mongoose.Schema({
    rating: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;