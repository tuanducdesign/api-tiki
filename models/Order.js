const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"},
    cart: [],
    address: {type: String, required: true},
    phoneNo: {type: String, required: true},
    name: {type: String, required: true},
    total: {type: Number, required: true},
});

module.exports = mongoose.model("Order", orderSchema);
