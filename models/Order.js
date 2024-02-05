const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Types.ObjectId,
        ref: "Product"
    }],
    payment: {},
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["pending", "fulfilled", "rejected"]
    }
},{timestamps: true})
const Order=mongoose.model('Order', orderSchema);
module.exports = Order;