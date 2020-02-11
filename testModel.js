const mongoose        = require("mongoose"),
      Product      = require("./models/Product"),
      Comment         = require("./models/Comment"),
      User            = require("./models/User"),
      Review            = require("./models/Review");


let url = process.env.DATABASEURL  ||  "mongodb://localhost:27017/tikiCloneV1";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

// CLOUDINARY
// img upload
let multer = require('multer');
let storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter});

let cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,//process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // process.env.CLOUDINARY_API_SECRET
});

// add this middle ware to addNewProduct, updateProduct, deleteProduct
// upload.single('image')

// Sign up
let req = {
    body: {
        username: "praise3",
        password: "test123",
        email: "oketola.praise3@gmail.com",
    }
};
async function signUp(){
    let newUser = new User({
        username: req.body.username,
        password: req.body.username,    // putting raw password
        email: req.body.email,
    });

    if (req.body.isAdmin === true) {
        newUser.isAdmin = true;
    }

    //find if email already exist
    await User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                // on unsuccessful req we set status of 400
                let error = 'Email already exists';
                console.log(error);
                // return res.status(400).json(error);
            }else{
                newUser.save()
                    .then(user => {
                        console.log(`User: `);
                        console.log(user);
                        // res.json(user)
                    }
                   )
                    .catch(err => console.log(err));
            }
        })
}
// Login
async function login(email){
    //find if email already exist
    await User.findOne({email: email})
        .then(user => {
            console.log(`user: `);
            console.log(user);
            // return res.status(400).json(user);
        })
}

// login("oketola.praise@gmail.com");


// product
async function getAllProducts() {
    //Get all products from DB
    Product.find({}, (err, allproducts) => {
        if (err) {
            console.log(err);
        } else {
            console.log(allproducts);
        }
    })
}
// getAllProducts();

async function getProductByType(category) {
    //Get all products from DB that is in that category
    Product.find({type: category}, (err, allproducts) => {
        if (err) {
            console.log(err);
        } else {
            console.log(allproducts);
        }
    })
}
// getProductByType("drink");

async function addNewProduct() {
    let newProduct = new Product({
        name: "Pepsi 4",
        price: 65.23,
        type: "drink",
        rating: 3,
        discount: 25, // in percentages,
        description: ["Smart can design for good sleep", "Especially effective in preventing reflux", "Soft and smooth pillows suitable for all babies",
        "Easy to clean and dry quickly"],
        // image: "",
        // imageId: ""
    });
    await newProduct.save()
        .then(prod =>{
            console.log(`product: `);
            console.log(prod);
    })
        .catch(err => console.log(err));

}
// addNewProduct()

// add upload middleware here
// this function includes cloudinary
async function addNewProduct_2() {
    let newProduct = new Product({
        name: "Pepsi 4",
        price: 65.23,
        type: "drink",
        rating: 3,
        discount: 25, // in percentages,
        description: ["Smart can design for good sleep", "Especially effective in preventing reflux", "Soft and smooth pillows suitable for all babies",
            "Easy to clean and dry quickly"],
        // image: "",
        // imageId: ""
    });
    await cloudinary.v2.uploader.upload(req.file.path, async function(err, result) {
        if (err) {
            console.log(err);
        }
        // add cloudinary url for the image to the product object under image property
        newProduct.image = result.secure_url;
        // add image's public_id to product object
        newProduct.imageId = result.public_id;
        // save product
        await newProduct.save()
            .then(prod =>{
                console.log(`product: `);
                console.log(prod);
            })
            .catch(err => console.log(err));
    });
}
// addNewProduct_2()

async function updateProduct(id, req) {
    // find and update the correct campground
    Product.findById(id, async (err, product)=>{
        if(err){
            console.log(err);
        } else {
            product.name = req.body.name;
            product.price = req.body.price;
            product.type = req.body.type ;
            product.rating = req.body.rating ;
            product.discount = req.body.discount ;
            product.description = req.body.description;
            await product.save();
            console.log(product);
        }
    });
}
// updateProduct("5e3d1831ce72363e000d3c58", {
//     body:{
//         name: "coke",
//         price: 23.12,
//         type: "drink",
//         rating: 4,
//         discount: 25, // in percentages,
//         description: ["Smart can design for good sleep", "Especially effective in preventing reflux", "Soft and smooth pillows suitable for all babies",
//             "Easy to clean and dry quickly"],
//     }
// });

// add upload middleware here
// update product function with cloudinary
async function updateProduct_2(id, req) {
    // find and update the correct campground
    Product.findById(id, async (err, product)=>{
        if(err){
            console.log(err);
        } else {
            if (req.file) {
                try {
                    // remove the previous image from cloudinary
                    await cloudinary.v2.uploader.destroy(product.imageId);   // wait for this to finish running before continuing
                    // upload new picture to cloudinary
                    let result = await cloudinary.v2.uploader.upload(req.file.path);
                    product.imageId = result.public_id;
                    product.image = result.secure_url;
                } catch(err) {
                    console.log(err);
                }
            }
            product.name = req.body.name;
            product.price = req.body.price;
            product.type = req.body.type ;
            product.rating = req.body.rating ;
            product.discount = req.body.discount ;
            product.description = req.body.description;
            await product.save();
            console.log(product);
        }
    });
}
// updateProduct("5e3d1831ce72363e000d3c58", {
//     body:{
//         name: "coke",
//         price: 23.12,
//         type: "drink",
//         rating: 4,
//         discount: 25, // in percentages,
//         description: ["Smart can design for good sleep", "Especially effective in preventing reflux", "Soft and smooth pillows suitable for all babies",
//             "Easy to clean and dry quickly"],
//     }
// });

async function deleteProduct(id) {
    Product.findById(id, async (err, product)=> {
        if(err) {
            console.log(err);
        }
        try {
            // deletes all comments associated with the product
            Comment.remove({"_id": {$in: Product.comments}}, function (err) {
                if (err) {
                    console.log(err);
                }
                // deletes all reviews associated with the product
                Review.remove({"_id": {$in: Product.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
            //  delete the product
            product.remove();
            console.log(`product deleted`);

        } catch(err) {
            console.log(err);
        }
    });
}
// deleteProduct("5e3d1831ce72363e000d3c58");


// add upload middleware here
// delete product function with cloudinary
async function deleteProduct_2(id) {
    Product.findById(id, async (err, product)=> {
        if(err) {
            console.log(err);
        }
        try {
            await cloudinary.v2.uploader.destroy(product.imageId);
            // deletes all comments associated with the product
            Comment.remove({"_id": {$in: Product.comments}}, function (err) {
                if (err) {
                    console.log(err);
                }
                // deletes all reviews associated with the product
                Review.remove({"_id": {$in: Product.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
            //  delete the product
            product.remove();
            console.log(`product deleted`);

        } catch(err) {
            console.log(err);
        }
    });
}
// deleteProduct("5e3d1831ce72363e000d3c58");


// comment
async function getComments(productId) {
    await Product.findById(productId).populate({
        path: "comments",
        options: {sort: {createdAt: -1}} // sorting the populated comment array to show the latest first
    }).exec(function (err, product) {
        if (err || !product) {
            console.log(err);
        }
        console.log("Got comment");
        console.log(product.comments);
    });
}
// getComments("5e3d2761c7f3ac3cb02a780f");

async function addComment(productId, comment_, userId, user) {
    // lookup product using ID
    await Product.findById(productId, (err, products)=>{
        if(err){
            console.log(err);
        }else{
            Comment.create(comment_, (err, comment)=>{
                if (err){
                    console.log(err)
                } else{
                    // add the comment
                    // add username and id to comment
                    comment.author.id = userId;
                    comment.author.username = user.username;
                    comment.save();
                    products.comments.push(comment);
                    products.save();
                    console.log(`comment added successfully`);
                }
            });
        }
    });
}
// addComment( "5e3d2761c7f3ac3cb02a780f",{text: "very good product"},"5e3d0fdb312d653fd4609389", {username: "praise"});

async function updateComment(comment_id, comment) {
    await Comment.findByIdAndUpdate(comment_id, comment, (err, updatedComment)=>{
        if(err){
            console.log(err);
        }else{
            console.log(`updated comment`);
            console.log(updatedComment);
        }
    })
}
// updateComment("5e3d2918a393bd1f04e0757d",{text: "Nice product, i like it"});

async function deleteComment(comment_id) {
    //findbyIdAndRemove
    Comment.findByIdAndRemove(comment_id, (err)=>{
        if(err){
            console.log(err);
        } else{
            console.log(`deleted comment`);
        }
    })
}
// deleteComment("5e3d2b0a9090410a50cca09c");

// review

async function getReview(productId) {
    Product.findById(productId).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} // sorting the populated reviews array to show the latest first
    }).exec(function (err, product) {
        if (err || !product) {
            console.log(err);
        }
        console.log("Got review");
        console.log(product.reviews);
    });
}
// getReview("5e3d2761c7f3ac3cb02a780f");


async function addReview(productId, review_, userId, user) {
    //lookup product using ID
    Product.findById(productId).populate("reviews").exec((err, product)=> {
        if (err) {
            console.log(err);
        }
        Review.create(review_,  (err, review)=> {
            if (err) {
                console.log(err);
            }
            //add author username/id and associated product to the review
            review.author.id = userId;
            review.author.username = user.username;
            review.product = product;
            //save review
            review.save();
            product.reviews.push(review);
            // calculate the new average review for the product
            product.rating = calculateAverage(product.reviews);
            //save campground
            product.save();
            console.log(`review added succesfully`);
        });
    });
}
// addReview( "5e3d2761c7f3ac3cb02a780f",{text: "trash, very bad service", rating: 3},"5e3d0fdb312d653fd4609389", {username: "praise"});


async function updateReview(review_id, productId, review) {
    Review.findByIdAndUpdate(review_id, review, {new: true}, (err, updatedReview)=> {
        if (err) {
            console.log(err);
            return;
        }
        Product.findById(productId).populate("reviews").exec((err, product)=> {
            if (err) {
                console.log(err);
                return;
            }
            // recalculate product average review
            product.rating = calculateAverage(product.reviews);
            //save changes
            product.save();
            console.log(`review updated successfully`);
            console.log(updatedReview);
        });
    });
}
// updateReview("5e3d2d91d60450404c642776","5e3d2761c7f3ac3cb02a780f",{text: "good, nice service", rating: 5});


async function deleteReview(review_id, productId) {
    Review.findByIdAndRemove(review_id,  (err)=> {
        if (err) {
            console.log(err);
            return;
        }
        Product.findByIdAndUpdate(productId, {$pull: {reviews: review_id}}, {new: true}).populate("reviews").exec((err, product)=> {
            if (err) {
                console.log(err);
                return;
            }
            // recalculate product average review
            product.rating = calculateAverage(product.reviews);
            //save changes
            product.save();
            console.log(`review successfully deleted`);
        });
    });
}
// deleteReview("5e3d2d91d60450404c642776", "5e3d2761c7f3ac3cb02a780f");

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}


