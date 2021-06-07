const mongoose = require('mongoose')

const supplierGroupSchema = mongoose.Schema({
    supplierGroup : {
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
    cp : {
        type : Number,
    }, 
    remarks : {
        type : String,
    }
})

module.exports = supplierGroupSchema