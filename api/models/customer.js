const mongoose = require('mongoose')

const customerSchema =  mongoose.Schema({
    customer : {
        type : String,
    },
    customerGroup : {
        type : String,
    },
    dealsIn : {
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
    post : {
        type : String,
    },
    pan : {
        type : String,
    },
    gstNo : {
        type : String,
    },
    poc : {
        type : String,
    },
    creditLimit : {
        type : Number,
    },
    creditDays : {
        type : Number,
    },  
    blip : {
        type : Boolean,
    },
    blackList : {
        type : Boolean,
    }, 
    remarks : {
        type : String,
    }
})

module.exports = customerSchema