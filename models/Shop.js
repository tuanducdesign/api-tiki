const mongoose = require("mongoose");
// SCHEMA SETUP
let shopSchema = new mongoose.Schema({
    name: String,
    // to get the person who created the shop
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
}, {
        // if timestamps are set to true, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.
        timestamps: true
    });
let Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
