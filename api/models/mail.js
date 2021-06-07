const mongoose = require('mongoose')

const mailSchema = mongoose.Schema({
    serialNo : {
        type : Number,
    },
    date : {
        type : Date,        
    },
    sender : {
        type : String,
    },
    receiver : {
        type : String,
    },
    io : {
        type : String,
    },
    content : {
        type : String,
    },
    post : {
        type : String,
    },
    tid : {
        type : String,
    },
    remarks : {
        type : String,
    }
})

module.exports = mailSchema