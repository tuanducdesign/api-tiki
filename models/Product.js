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


});
let Product = mongoose.model("Product", productSchema);
module.exports = Product;
