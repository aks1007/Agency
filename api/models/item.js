const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    item : {
        type : String,
    },
    hsnCode : {
        type : String,
    },
    itemGroup : {
        type : String,
    },
    itemCut : {
        type : Number,
    },
    rpm : {
        type : Number,
    },
    rpp : {
        type : Number,
    },

})

module.exports = itemSchema