const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: (true, "Email is required")
    },
    password: {
        type: String,
        required: (true, "Password is required")
    },
    restaurants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        }
    ]
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;