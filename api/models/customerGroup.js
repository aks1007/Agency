const mongoose = require('mongoose')

const customerGroupSchema = mongoose.Schema({
    customerGroup : {
        type : String,
    },
    dealsIn : {
        type : String,
    },
    poc : {
        type : String,
    },
    phoneNo : {
        type : Number,
    },
    mobileNo : {
        type : Number,
    },
    emailId : {
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
    },    
    remarks : {
        type : String,
    }
})

module.exports =customerGroupSchema