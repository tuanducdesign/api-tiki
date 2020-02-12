const mongoose        = require("mongoose"),
      Shop          = require("./models/Shop"),
      Product      = require("./models/Product"),
      Comment         = require("./models/Comment"),
      User            = require("./models/User"),
      Order         = require("./models/Order"),
      Review            = require("./models/Review");


let url = process.env.DATABASEURL  ||  "mongodb://localhost:27017/tikiCloneV1";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

// CLOUDINARY
// img upload
// let multer = require('multer');
// let storage = multer.diskStorage({
//     filename: function(req, file, callback) {
//         callback(null, Date.now() + file.originalname);
//     }
// });
// let imageFilter = function (req, file, cb) {
//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
// let upload = multer({ storage: storage, fileFilter: imageFilter});
//
// let cloudinary = require('cloudinary');
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,//process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET // process.env.CLOUDINARY_API_SECRET
// });

// add this middle ware to addNewProduct, updateProduct, deleteProduct
// upload.single('image')


// Sign up
let req = {
    body: {
        username: "praise3",
        password: "test123",
        email: "oketola.praise6@gmail.com",
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
    if (req.body.isSeller === true) {
        newUser.isSeller = true;
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
// signUp();


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

// login("oketola.praise6@gmail.com");

/**=========================
 * SHOP
 * =========================**/
async function addShop(userId, name, username){
    let newShop = new Shop({
        name: name,
        author: {
            id: userId,
            username: username
        }
    });
    await newShop.save()
        .then(async shop =>{
            console.log(`shop: `);
            console.log(shop);
            // update shopId for user
            await User.findById(userId)
                .then(user => {
                    user.shopId.push(shop._id);
                    user.save();
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err));

}
// addShop("5e42887a059ef8043c8386a8", "Praise's shop v22", "praise");

async function getAllShops(){
    //Get all shops from DB
    Shop.find({}, (err, allproducts) => {
        if (err) {
            console.log(err);
        } else {
            console.log(allproducts);
        }
    })
}
// getAllShops()

async function getShopById(shopId) {
    //Get all products from DB that is in that category
    await Shop.findById(shopId, (err, shop) => {
        if (err) {
            console.log(err);
        } else {
            console.log(shop);
        }
    })
}
// getShopById("5e4288921dc5343f44f23c8b");

async function getShopByIdWithProductsPopulated(shopId){    // populates the products array with products instead of id
    //Get all products from DB that is in that category
    let shop = await Shop.findById(shopId).populate('products').exec();
    console.log(shop);
}
// getShopByIdWithProductsPopulated("5e4288921dc5343f44f23c8b");


async function deleteShop(shopId){
    await Shop.findById(shopId, async (err, shop)=>{
        // delete every product in the shop
         for (let i = 0; i < shop.products.length; i++) {
            await Product.findById(shop.products[i], async (err, product)=> {
                if(err) {
                    console.log(err);
                }
                try {
                    // deletes all comments associated with the product
                    await Comment.remove({"_id": {$in: Product.comments}}, async(err)=> {
                        if (err) {
                            console.log(err);
                        }
                        // deletes all reviews associated with the product
                    await Review.remove({"_id": {$in: Product.reviews}}, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    });
                    //  delete the product
                    await product.remove();
                    console.log(`product deleted`);

                } catch(err) {
                    console.log(err);
                }
            });
        }
         // delete shop id from user
        await User.findById(shop.author.id, async(err, user)=>{
           let updatedShopId = user.shopId.filter(shop_id => shop_id != shopId);
            user.shopId = updatedShopId;
           await user.save()
        });
         // remove shop
        await shop.remove();
        console.log(`shop deleted`);
    });
}
// deleteShop("5e4286e9de141929c8fa2187");

async function updateShop(shopId, name, username, userId){
    // find and update the correct product
    await Shop.findById(shopId, async (err, shop)=>{
        if(err){
            console.log(err);
        } else {
            shop.name = name;
            shop.author = {
                id: userId,
                    username: username
            };
            await shop.save();
            console.log(shop);
        }
    });
}
// updateShop("5e427bfdb64a5b460c4b14af", "Praise's shop v3", 'praise', "5e427bc7e948424734a2aed2" );


/**======================
 * PRODUCTS
 * ======================**/
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

async function getTopRecentProducts() {
    //Get all products from DB
    Product.find({}, (err, allproducts) => {
        if (err) {
            console.log(err);
        } else {
            //
            console.log(allproducts.slice(0, 10));
        }
    })
}
// getTopRecentProducts();

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

async function getProductByShopId(shopId) {

    //Get all products from DB that is in that shop
    await Product.find({shop: shopId}, (err, allproducts) => {
        if (err) {
            console.log(err);
        } else {
            console.log(allproducts);
        }
    })
}
// getProductByShopId("5e427bfdb64a5b460c4b14af");

async function addNewProduct(shopId, userId, username) {
    let newProduct = new Product({
        name: "Pepsi 3",
        price: 65.23,
        type: "drink",
        rating: 3,
        discount: 25, // in percentages,
        description: ["Smart can design for good sleep", "Especially effective in preventing reflux", "Soft and smooth pillows suitable for all babies",
        "Easy to clean and dry quickly"],
        shop: shopId,
        author: userId,
        username: username
        // image: "",
        // imageId: ""
    });
    await newProduct.save()
        .then( async prod =>{
            console.log(`product: `);
            console.log(prod);
            await Shop.findById(shopId, async (err, shop)=>{
                if (err) console.log(err);
                await shop.products.push(prod);
                await shop.save();
                console.log(shop);
            })
    })
        .catch(err => console.log(err));
}
// addNewProduct("5e4288921dc5343f44f23c8b", "5e42887a059ef8043c8386a8", "praise");

// add upload middleware here
// this function includes cloudinary
async function addNewProduct_2(shopId, userId, username) {
    let newProduct = new Product({
        name: "Pepsi 4",
        price: 65.23,
        type: "drink",
        rating: 3,
        discount: 25, // in percentages,
        description: ["Smart can design for good sleep", "Especially effective in preventing reflux", "Soft and smooth pillows suitable for all babies",
            "Easy to clean and dry quickly"],
        shop: shopId,
        author: userId,
        username: username
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
            .then( async prod =>{
                console.log(`product: `);
                console.log(prod);
                await Shop.findById(shopId, async (err, shop)=>{
                    console.log(shop);
                    if (err) console.log(err);
                    await shop.products.push(prod);
                    await shop.save()
                })
            })
            .catch(err => console.log(err));
    });
}
// addNewProduct_2()

async function updateProduct(id, req) {
    // find and update the correct product
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
// updateProduct("5e427ce51c53b00708a86608", {
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
    // find and update the correct product
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
    await Product.findById(id, async (err, product)=> {
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
            await Shop.findById(product.shop, async (err, shop)=>{  // remove deleted products from shop
               let updatedProducts = shop.products.filter(product => product != id) ;
                shop.products = updatedProducts;
                await shop.save()
            });

            //  delete the product
            await product.remove();
            console.log(`product deleted`);

        } catch(err) {
            console.log(err);
        }
    });

}
// deleteProduct("5e4288c57345872d48db5db7");


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
            await Shop.findById(product.shop, async (err, shop)=>{  // remove deleted products from shop
                let updatedProducts = shop.products.filter(product => product != id) ;
                shop.products = updatedProducts;
                shop.save()
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


/**=========================
 * COMMENT
 * =========================**/
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

/**=========================
 * REVIEW
 * =========================**/

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
            //save product
            product.save();
            console.log(`review added successfully`);
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


/**=========================
 * ORDER
 * =========================**/

async function makeOrder(userId, cart, address, phoneNo, total) {
    let order;
    await  User.findById(userId, async (err, user)=>{
        user.address = address;
        user.phoneNo = phoneNo;
        await user.save();
        order = new Order({
            user: userId,
            cart: cart,
            address: address,
            name: user.username,
            phoneNo: phoneNo,
            total: total
        });
        await order.save((err, result) =>{
            if (err){
                console.log(err);
            }
            console.log(`order Saved`);
        });
    });
}

// makeOrder("5e42743b63cb902650bef4e6", [ {quantity: "2", productPrice: "120", productTitle: "pepsi", sum: "240"}, {quantity: "1", productPrice: "100", productTitle: "coke", sum: "100"} ], "18 hoang quoc viet", "0373625279", 340);

async function getOrders(userId) {
    await Order.find({user: userId},  (err, orders)=> {
        if(err){
            console.log(err);
        }
        console.log(orders);
    });
}

// getOrders("5e42743b63cb902650bef4e6");
function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    let sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}


