const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    serialNo : {
        type : Number,
    },
    entryNo : {
        type : Number,
    },
    doe : {
        type : Date,
    },
    dop : {
        type : Date,        
    },
    customer : {
        type : String,
    },
    supplier : {
        type : String,
    },
    gr : {
        type : String,
    },
    mop : {
        type : String,
    },  
    ta : {
        type : Number,
    },
    aa : {
        type : Number,
    },
    ba : {
        type : Number,
    },
    brokP : {
        type : Number,
    },
    brok : {
        type : Number,
    },
    remarks : {
        type : String,
    }, 
    brokReceived : {
        type : Boolean,
        default : false,
    }
})

module.exports = paymentSchema