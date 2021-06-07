const mongoose = require('mongoose')

const transporterSchema = mongoose.Schema({
    transporter : {
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

module.exports = transporterSchema