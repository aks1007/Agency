const mongoose = require('mongoose')

const goodsReturnBillSchema = mongoose.Schema({    
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
    ta : {
        type : Number,
    },
    gstP : {
        type : Number,
    },
    gstA : {
        type : Number,
    },
    grA : {
        type : Number,
    },
    lrNo : {
        type : Number,
    },
    lrDate : {
        type : Date,
    },
    transporter : {
        type : String,
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

module.exports = goodsReturnBillSchema