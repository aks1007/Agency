const mongoose = require('mongoose')

const brokerageVoucherSchema = mongoose.Schema({    
    serialNo : {
        type : Number,
    },
    id : {
        type : Number,
    },
    select : {
        type : Boolean
    },
    vouNo : {
        type : Number,
    },
    vouDate : {
        type : Date,
    }, 
    customer : {
        type : String,
    }, 
    bills : {
        type : String,
    }, 
    amount : {
        type : Number,
    },
    brokP : {
        type : Number,
    },
    brok : {
        type : Number,
    }
})

module.exports = brokerageVoucherSchema