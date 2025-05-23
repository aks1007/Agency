const mongoose = require('mongoose')

const mailChequeSchema = mongoose.Schema({    
    serialNo : {
        type : Number,
    },
    cId : {
        type : Number,
    },
    cNo : {
        type : Number,
    },
    cDate : {
        type : Date,
    },
    bank : {
        type : String,
    },
    cAmount : {
        type : Number,
    },
})

module.exports = mailChequeSchema