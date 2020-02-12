const mongoose = require("mongoose");
// SCHEMA SETUP
let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    type: {
        type:String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    discount: Number,
    image: String,
    imageId: String,    // for deleting in cloudinary
    description: [
        {
            type: String
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
}, {
    // if timestamps are set to true, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.
    timestamps: true
});
let Product = mongoose.model("Product", productSchema);
module.exports = Product;
