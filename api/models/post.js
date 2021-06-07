const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    post : {
        type : String,
    },
    emailId : {
        type : String,
    },
    phoneNo : {
        type : Number,
    },
    remarks : {
        type : String,
    },
    line1 : {
        type : String,
    },
    line2 : {
        type : String,
    },
    city : {
        type : String,
    },
    state : {
        type : String,
    },
    pinCode : {
        type : String,
    }


})

module.exports = postSchema