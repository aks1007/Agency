const mongoose = require('mongoose')

const invoiceSchema = mongoose.Schema({    
    serialNo : {
        type : Number,
    },
    id : {
        type : Number,
    },
    item : {
        type : String,
    },
    hsnCode : {
        type : String,
    },
    pcs : {
        type : Number,
    },
    cut : {
        type : Number,
    },
    mts : {
        type : Number,
    },
    rate : {
        type : Number,
    },
    unit : {
        type : String,
    },
    amount : {
        type : Number,
    }
})

module.exports = invoiceSchema