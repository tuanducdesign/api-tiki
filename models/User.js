const mongoose = require('mongoose');



//Create table
let UserSchema = new mongoose.Schema({
    //Data goes here
    username : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {type: Boolean, default: false},
    address:{
        type:String,    // to remember user address when checking out next time. Doesn't have to be in the sign up form
    },
    phoneNo: {
        type: String,  //  to remember user address when checking out next time. Doesn't have to be in the sign up form
    }

});

module.exports = mongoose.model('User',UserSchema);
