const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
    tip1: {
        type: Number,
        min:0,
        default:0,
        required: true
    },
    tip2: {
        type: Number,
        min:0,
        default:0,
        required: true
    },
    tip3: {
        type: Number,
        min:0,
        default:0,
        required: true
    }
})

const Tip = mongoose.model("Tip", tipSchema);

module.exports = Tip;