const mongoose = require('mongoose')

const orderFormSchema = mongoose.Schema({
    serialNo : {
        type : Number,
    },
    date : {
        type : Date,        
    },
    customer : {
        type : String,
    },
    supplier : {
        type : String,
    },
    orderNo : {
        type : Number,
    },
    transporter : {
        type : String,
    },
    case : {
        type : Number,
    },
    destination : {
        type : String,
    },
    remarks : {
        type : String,
    }
})

module.exports = orderFormSchema