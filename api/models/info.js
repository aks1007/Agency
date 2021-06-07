const mongoose = require('mongoose')

const infoSchema = mongoose.Schema({ 
    sNo : {
        type : Number,
    },   
    companyName : {
        type : String,
    },
    gstin : {
        type : String,
    },
    pan : {
        type : String,
    },    
    phoneNo : {
        type : Number,
    },
    telephoneNo : {
        type : Number,
    },
    email : {
        type : String,
    },
    address : {
        type : String,
    }
})

module.exports = infoSchema