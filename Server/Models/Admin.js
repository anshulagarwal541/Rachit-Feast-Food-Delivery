const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    memberId: {
        type: String,
        required: true
    },
    memberPin: {
        type: Number,
        required: true
    }
})

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;