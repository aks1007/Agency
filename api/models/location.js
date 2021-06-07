const mongoose = require('mongoose')

const locationSchema = mongoose.Schema({
    city : {
        type : String,
    },
    state : {
        type : String,
    },
    stdCode : {
        type : String,
    }
})

module.exports = locationSchema