const mongoose = require('mongoose')

const invoiceSchema = mongoose.Schema({
    serialNo : {
        type : Number,
    },
    billNo : {
        type : Number,
    },
    entryNo : {
        type : Number,
    },
    orderNo : {
        type : Number,
    },
    date : {
        type : Date,        
    },
    subAgent : {
        type : String,
    },
    customer : {
        type : String,
    },
    supplier : {
        type : String,
    },
    transporter : {
        type : String,
    },
    destination : {
        type : String,
    },
    cases : {
        type : Number,
    },
    lrDate : {
        type : Date,
    },
    lrNo : {
        type : Number,
    },
    ca : {
        type : Number,
    },
    pc : {
        type : Number,
    },
    pcP : {
        type : Number,
    },
    rd : {
        type : Number,
    }, 
    rdP : {
        type : Number,
    },
    dd : {
        type : Number,
    },
    ddP : {
        type : Number,
    },
    disc : {
        type : Number,
    },
    discP : {
        type : Number,
    },
    sc : {
        type : Number,
    },
    scP : {
        type : Number,
    },
    sl : {
        type : Number,
    },
    slP : {
        type : Number,
    },
    cgst : {
        type : Number,
    },
    cgstP : {
        type : Number,
    },
    igst : {
        type : Number,
    },
    igstP : {
        type : Number,
    },
    sgst : {
        type : Number,
    },
    sgstP : {
        type : Number,
    },
    netAmount : {
        type : Number,
    },
    remarks : {
        type : String,
    },
    status : {
        type :String,
        default : "PENDING",
    },
    grA : {
        type :Number,
        default : 0,
    },
    paid : {
        type :Number,
        default : 0,
    }
})

module.exports = invoiceSchema