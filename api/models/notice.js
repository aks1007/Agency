const mongoose = require('mongoose')

const noticeSchema = mongoose.Schema({
    serialNo : {
        type : Number,
    },
    date : {
        type : Date,        
    },
    subject : {
        type : String,
    },
    to : {
        type : String,
    },
    notice : {
        type : String,
    }
})

module.exports = noticeSchema