const mongoose = require('mongoose')

const paymentBillSchema = mongoose.Schema({    
    serialNo : {
        type : Number,
    },
    id : {
        type : Number,
    },
    billNo : {
        type : Number,
    },
    na : {
        type : Number,
    },
    ba : {
        type : Number,
    },
    dd : {
        type : Number,
    },
    grA : {
        type : Number,
    },
    rd : {
        type : Number,
    }, 
    cl : {
        type : Number,
    },
    discP : {
        type : Number,
    },
    disc : {
        type : Number,
    },
    pc : {
        type : Number,
    }, 
    ol : {
        type : Number,
    }, 
    intP : {
        type : Number,
    },
    int : {
        type : Number,
    },
    oa : {
        type : Number,
    },
    paid : {
        type : Number,
    }, 
    status : {
        type : String,
    }, 
    customer : { 
        type : String,
    }, 
    supplier : {
        type : String,
    }
})

module.exports = paymentBillSchema