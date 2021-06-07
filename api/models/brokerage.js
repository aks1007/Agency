const mongoose = require('mongoose')

const brokerageSchema = mongoose.Schema({
    serialNo : {
        type : Number,
    },
    entryNo : {
        type : Number,
    },    
    date : {
        type : Date,        
    },
    supplier : {
        type : String,
    },
    mop : {
        type : String,
    },
    txnNo : { 
        type : Number,
    },
    txnDate : {
        type : Date,
    },
    bank : {
        type : String,
    },
    brokReceived : {
        type : Number,
    },
    tds : {
        type : Number,
    },
    totalBrok : {
        type : Number,
    },
    gstP : {
        type : Number,
    },
    brokP : {
        type : Number,
    },
    from : {
        type : Date,
    }, 
    to : {
        type : Date,
    }, 
    selectAll : {
        type : Boolean,
    },
    remarks : {
        type : String,
    }
})

module.exports = brokerageSchema