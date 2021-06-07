const mongoose = require('mongoose')

const goodsReturnSchema = mongoose.Schema({
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
    cNo : {
        type : Number,
    },
    dNo : {
        type : Number,
    },
    agrNo : {
        type : Number,
    },   
    tta : {
        type : Number,
    },
    tax : {
        type : Number,
    },
    tgra : {
        type : Number,
    },
    remarks : {
        type : String,
    }
})

module.exports = goodsReturnSchema