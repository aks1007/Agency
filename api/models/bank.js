const mongoose = require('mongoose')

const bankSchema = mongoose.Schema({
    bank : {
        type : String
    }
})

module.exports =  bankSchema
