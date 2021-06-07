const mongoose = require('mongoose')

const paymentFtSchema = mongoose.Schema({    
    serialNo : {
        type : Number,
    },
    ftId : {
        type : Number,
    },
    utrNo : {
        type : String,
    },
    ftDate : {
        type : Date,
    },
    bank : {
        type : String,
    },
    ftAmount : {
        type : Number,
    },
})

module.exports = paymentFtSchema